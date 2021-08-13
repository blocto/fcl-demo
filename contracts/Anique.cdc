/*
    Description: Central Smart Contract for Anique

    authors: Atsushi Otani atsushi.ootani@anique.jq
 */

import NonFungibleToken from 0xNFTADDRESS

pub contract Anique: NonFungibleToken {

    // -----------------------------------------------------------------------
    // Anique contract Events
    // -----------------------------------------------------------------------

    // Events for Contract-Related actions
    //
    // Emitted when the Anique contract is created
    pub event ContractInitialized()

    // Events for Series-Related actions
    //
    // emitted when a new series has been triggered by an admin
    pub event NewSeriesStarted(newSeries: UInt32)

    // Events for Set-Related actions
    //
    // emitted when a new Set is created
    pub event SetCreated(setID: UInt32, series: UInt32, name: String)
    // emitted when a new play is added to a set
    pub event ItemAddedToSet(setID: UInt32, itemID: UInt32)

    // Events for Item-Related actions
    //
    // Emitted when a new Item struct is created
    pub event ItemCreated(id: UInt32, metadata: {String:String})

    // Events for Collectible-Related actions
    //
    // Emitted when an CollectibleData NFT is minted
    pub event CollectibleMinted(collectibleID: UInt64, itemID: UInt32, setID: UInt32, serialNumber: UInt32)
    // Emitted when an CollectibleData NFT is destroyed
    pub event CollectibleDestroyed(collectibleID: UInt64)

    // events for Collection-related actions
    //
    // Emitted when an CollectibleData is withdrawn from a Collection
    pub event Withdraw(id: UInt64, from: Address?)
    // Emitted when an CollectibleData is deposited into a Collection
    pub event Deposit(id: UInt64, to: Address?)


    // -----------------------------------------------------------------------
    // Anique contract-level fields.
    // These contain actual values that are stored in the smart contract.
    // -----------------------------------------------------------------------

    // fields for Series-related
    //
    // Series that this set belongs to
    // Series is a concept that indicates a group of sets through time
    // Many sets can exist at a time, but only one series
    pub var currentSeries: UInt32

    // fields for Set-related
    //
    // variable size dictionary of Set resources
    access(self) var sets: @{UInt32: Set}

    // the ID that is used to create Sets. Every time a Set is created
    // setID is assigned to the new set's ID and then is incremented by 1.
    pub var nextSetID: UInt32

    // fields for Item-related
    //
    // Variable size dictionary of Item structs
    access(self) var itemDatas: {UInt32: Item}

    // The ID that is used to create Items.
    pub var nextItemID: UInt32

    // fields for Collectible-related
    //
    // Total number of CollectibleData NFTs that have been minted ever.
    pub var totalSupply: UInt64

    // -----------------------------------------------------------------------
    // Anique contract-level Composite Type definitions
    // -----------------------------------------------------------------------

    // The structure that represents Item
    // each digital content which Anique deal with on Flow
    //
    pub struct Item {

        // The unique ID for the Item
        pub let itemID: UInt32

        // Stores all the metadata about the item as a string mapping
        // This is not the long term way NFT metadata will be stored. It's a temporary
        // construct while we figure out a better way to do metadata.
        //
        pub let metadata: {String: String}

        init(metadata: {String: String}) {
            pre {
                metadata.length != 0: "New Item metadata cannot be empty"
            }
            self.itemID = Anique.nextItemID
            self.metadata = metadata

            // Increment the ID so that it isn't used again
            Anique.nextItemID = Anique.nextItemID + (1 as UInt32)

            emit ItemCreated(id: self.itemID, metadata: metadata)
        }
    }

    // SetData is a struct that is stored in a public field of the contract.
    // This is to allow anyone to be able to query the constant information
    // about a set but not have the ability to modify any data in the
    // private set resource
    //
    pub struct SetData {
        // unique ID for the set
        pub let setID: UInt32

        // Name of the Set
        pub let name: String

        // Series that this Set belongs to
        // Series is a concept that indicates a group of Sets through time
        // Many Sets can exist at a time, but only one Series
        pub let series: UInt32

        // Array of Items that are a part of this Set
        // When an Item is added to the Set, its ID gets appended here
        pub var items: [UInt32]

        // Indicates the number of Collectibles
        // that have been minted per Item in this Set
        // When a Collectible is minted, this value is stored in the Collectible to
        // show where in the Item Set it is so far. ex. 13 of 60
        pub var numberMintedPerItem: {UInt32: UInt32}

        init(setID: UInt32) {
            pre {
                Anique.sets[setID] != nil: "Set doesn't exist"
            }

            // remove the Set from the dictionary to get its field
            if let setToRead <- Anique.sets.remove(key: setID) {

                self.setID = setID
                self.name = setToRead.name
                self.series = setToRead.series
                self.items = setToRead.items
                self.numberMintedPerItem = setToRead.numberMintedPerItem

                // put the set back
                Anique.sets[setID] <-! setToRead
            } else {
                self.setID = 0
                self.name = ""
                self.series = 0
                self.items = []
                self.numberMintedPerItem = {}
            }
        }
    }

    // Set is a resource type that contains the functions to add and remove
    // Items from a Set and mint Collectibles.
    //
    // It is stored in a private field in the contract so that
    // the admin resource can call its methods and that there can be
    // public getters for some of its fields
    //
    // The admin can add Items to a Set so that the Set can mint Collectibles
    // that reference that Item.
    // The Collectibles that are minted by a Set will be listed as belonging to
    // the Set that minted it, as well as the Item it references
    //
    pub resource Set {

        // unique ID for the set
        pub let setID: UInt32

        // Name of the Set
        pub let name: String

        // Series that this Set belongs to
        // Series is a concept that indicates a group of Sets through time
        // Many Sets can exist at a time, but only one Series
        pub let series: UInt32

        // Array of Items that are a part of this Set
        // When an Item is added to the Set, its ID gets appended here
        pub var items: [UInt32]

        // Indicates the number of Collectibles
        // that have been minted per Item in this Set
        // When a Collectible is minted, this value is stored in the Collectible to
        // show where in the Item Set it is so far. ex. 13 of 60
        pub var numberMintedPerItem: {UInt32: UInt32}

        init(name: String) {
            pre {
                name.length > 0: "New Set name cannot be empty"
            }

            self.setID = Anique.nextSetID
            self.name = name
            self.series = Anique.currentSeries
            self.items = []
            self.numberMintedPerItem = {}

            // increment the setID so that it isn't used again
            Anique.nextSetID = Anique.nextSetID + (1 as UInt32)

            emit SetCreated(setID: self.setID, series: self.series, name: self.name)
        }

        // addItem adds an Item to the Set
        //
        // Parameters: itemID: The ID of the Item that is being added
        //
        // Pre-Conditions:
        // The Item needs to be an existing Item
        // The Item can't have already been added to the Set
        //
        pub fun addItem(itemID: UInt32) {
            pre {
                Anique.itemDatas[itemID] != nil: "Cannot add the Item to Set: Item doesn't exist"
                self.numberMintedPerItem[itemID] == nil: "The Item has already been added to the Set"
            }

            // Add the Item to the array of Items
            self.items.append(itemID)

            // Initialize the Collectible count to zero
            self.numberMintedPerItem[itemID] = 0

            emit ItemAddedToSet(setID: self.setID, itemID: itemID)
        }

        // addItems adds multiple Items to the Set
        //
        // Parameters: itemIDs: The IDs of the Items that are being added
        //                      as an array
        //
        pub fun addItems(itemIDs: [UInt32]) {
            for itemID in itemIDs {
                self.addItem(itemID: itemID)
            }
        }

        // mintCollectible mints a new Collectible and returns the newly minted Collectible
        //
        // Parameters: itemID: The ID of the Item that the Collectible references
        //
        // Pre-Conditions:
        // The Item must exist in the Set and be allowed to mint new Collectibles
        //
        // Returns: The NFT that was minted
        //
        pub fun mintCollectible(itemID: UInt32): @NFT {
            // get the number of Collectibles that have been minted for this Item
            // to use as this Collectible's serial number
            let numInItem = self.numberMintedPerItem[itemID]!

            // mint the new Collectible
            let newCollectible: @NFT <- create NFT(serialNumber: numInItem + (1 as UInt32),
                                              itemID: itemID,
                                              setID: self.setID)

            // Increment the count of Collectibles minted for this Item
            self.numberMintedPerItem[itemID] = numInItem + (1 as UInt32)

            return <-newCollectible
        }

        // batchMintCollectible mints an arbitrary quantity of Collectibles
        // and returns them as a Collection
        //
        // Parameters: itemID: the ID of the Item that the Collectibles are minted for
        //             quantity: The quantity of Collectibles to be minted
        //
        // Returns: Collection object that contains all the Collectibles that were minted
        //
        pub fun batchMintCollectible(itemID: UInt32, quantity: UInt64): @Collection {
            let newCollection <- create Collection()

            var i: UInt64 = 0
            while i < quantity {
                newCollection.deposit(token: <-self.mintCollectible(itemID: itemID))
                i = i + (1 as UInt64)
            }

            return <-newCollection
        }
    }

    // The structure holds metadata of an Collectible
    pub struct CollectibleData {

        // the ID of the Set that the Collectible comes from
        pub let setID: UInt32

        // The ID of the Item that the Collectible references
        pub let itemID: UInt32

        // The place in the Item that this Collectible was minted
        pub let serialNumber: UInt32

        init(setID: UInt32, itemID: UInt32, serialNumber: UInt32) {
            self.setID = setID
            self.itemID = itemID
            self.serialNumber = serialNumber
        }
    }

    // The resource that represents the CollectibleData NFTs
    //
    pub resource NFT: NonFungibleToken.INFT {

        // Global unique collectibleData ID
        pub let id: UInt64

        // Struct of Collectible metadata
        pub let data: CollectibleData

        init(serialNumber: UInt32, itemID: UInt32, setID: UInt32) {
            // Increment the global Collectible IDs
            Anique.totalSupply = Anique.totalSupply + (1 as UInt64)

            // set id
            self.id = Anique.totalSupply

            // Set the metadata struct
            self.data = CollectibleData(setID: setID, itemID: itemID, serialNumber: serialNumber)

            emit CollectibleMinted(collectibleID: self.id, itemID: itemID, setID: setID, serialNumber: self.data.serialNumber)
        }

        destroy() {
            emit CollectibleDestroyed(collectibleID: self.id)
        }
    }

    // This is the interface that users can cast their Collectible Collection as
    // to allow others to deposit Collectibles into their Collection. It also allows for reading
    // the IDs of Collectible in the Collection.
    pub resource interface CollectibleCollectionPublic {
        pub fun deposit(token: @NonFungibleToken.NFT)
        pub fun batchDeposit(tokens: @NonFungibleToken.Collection)
        pub fun getIDs(): [UInt64]
        pub fun contains(id: UInt64): Bool
        pub fun borrowNFT(id: UInt64): &NonFungibleToken.NFT
        pub fun borrowCollectible(id: UInt64): &Anique.NFT? {
            // If the result isn't nil, the id of the returned reference
            // should be the same as the argument to the function
            post {
                (result == nil) || (result?.id == id):
                    "Cannot borrow Collectible reference: The ID of the returned reference is incorrect"
            }
        }
    }

    // Collection is a resource that every user who owns NFTs
    // will store in their account to manage their NFTs
    //
    pub resource Collection: CollectibleCollectionPublic, NonFungibleToken.Provider, NonFungibleToken.Receiver, NonFungibleToken.CollectionPublic {
        // Dictionary of CollectibleData conforming tokens
        // NFT is a resource type with a UInt64 ID field
        pub var ownedNFTs: @{UInt64: NonFungibleToken.NFT}

        init() {
            self.ownedNFTs <- {}
        }

        // withdraw removes a Collectible from the Collection and moves it to the caller
        //
        // Parameters: withdrawID: The ID of the NFT
        // that is to be removed from the Collection
        //
        // returns: @NonFungibleToken.NFT the token that was withdrawn
        pub fun withdraw(withdrawID: UInt64): @NonFungibleToken.NFT {

            // Remove the nft from the Collection
            let token <- self.ownedNFTs.remove(key: withdrawID)
                ?? panic("Cannot withdraw: Collectible does not exist in the collection")

            emit Withdraw(id: token.id, from: self.owner?.address)

            // Return the withdrawn token
            return <-token
        }

        // batchWithdraw withdraws multiple tokens and returns them as a Collection
        //
        // Parameters: collectibleIds: An array of IDs to withdraw
        //
        // Returns: @NonFungibleToken.Collection: A collection that contains
        //                                        the withdrawn collectibles
        //
        pub fun batchWithdraw(collectibleIds: [UInt64]): @NonFungibleToken.Collection {
            // Create a new empty Collection
            var batchCollection <- create Collection()

            // Iterate through the collectibleIds and withdraw them from the Collection
            for collectibleID in collectibleIds {
                batchCollection.deposit(token: <-self.withdraw(withdrawID: collectibleID))
            }

            // Return the withdrawn tokens
            return <-batchCollection
        }

        // deposit takes a Collectible and adds it to the Collections dictionary
        //
        // Parameters: token: the NFT to be deposited in the collection
        //
        pub fun deposit(token: @NonFungibleToken.NFT) {

            // Cast the deposited token as an Anique NFT to make sure
            // it is the correct type
            let token <- token as! @Anique.NFT

            // Get the token's ID
            let id = token.id

            // Add the new token to the dictionary
            let oldToken <- self.ownedNFTs[id] <- token

            // Only emit a deposit event if the Collection
            // is in an account's storage
            if self.owner?.address != nil {
                emit Deposit(id: id, to: self.owner?.address)
            }

            // Destroy the empty old token that was "removed"
            destroy oldToken
        }

        // batchDeposit takes a Collection object as an argument
        // and deposits each contained NFT into this Collection
        pub fun batchDeposit(tokens: @NonFungibleToken.Collection) {

            // Get an array of the IDs to be deposited
            let keys = tokens.getIDs()

            // Iterate through the keys in the collection and deposit each one
            for key in keys {
                self.deposit(token: <-tokens.withdraw(withdrawID: key))
            }

            // Destroy the empty Collection
            destroy tokens
        }

        // getIDs returns an array of the IDs that are in the Collection
        pub fun getIDs(): [UInt64] {
            return self.ownedNFTs.keys
        }

        // contains returns whether ID is in the Collection
            pub fun contains(id: UInt64): Bool {
            return self.ownedNFTs[id] != nil
        }

        // borrowNFT Returns a borrowed reference to a Collectible in the Collection
        // so that the caller can read its ID
        //
        // Parameters: id: The ID of the NFT to get the reference for
        //
        // Returns: A reference to the NFT
        //
        // Note: This only allows the caller to read the ID of the NFT,
        // not any Anique specific data. Please use borrowCollectible to
        // read Collectible data.
        //
        pub fun borrowNFT(id: UInt64): &NonFungibleToken.NFT {
            return &self.ownedNFTs[id] as &NonFungibleToken.NFT
        }

        // borrowCollectible returns a borrowed reference to a Collectible
        // so that the caller can read data and call methods from it.
        // They can use this to read its serialNumber, itemID, setID
        // or any of the data associated with it and reading those fields from
        // the smart contract.
        //
        // Parameters: id: The ID of the NFT to get the reference for
        //
        // Returns: A reference to the NFT
        pub fun borrowCollectible(id: UInt64): &Anique.NFT? {
            if self.ownedNFTs[id] != nil {
                let ref = &self.ownedNFTs[id] as auth &NonFungibleToken.NFT
                return ref as! &Anique.NFT
            } else {
                return nil
            }
        }

        // If a transaction destroys the Collection object,
        // All the NFTs contained within are also destroyed!
        //
        destroy() {
            destroy self.ownedNFTs
        }
    }

    // Admin is a special authorization resource that
    // allows the owner to perform important functions to modify the
    // various aspects of the Items, CollectibleDatas, etc.
    //
    pub resource Admin {

        // createItem creates a new Item struct
        // and stores it in the Items dictionary field in the Anique smart contract
        //
        // Parameters: metadata: A dictionary mapping metadata titles to their data
        //                       example: {"Title": "Excellent Anime", "Author": "John Smith"}
        //
        // Returns: the ID of the new Item object
        //
        pub fun createItem(metadata: {String: String}): UInt32 {
            // Create the new Item
            var newItem = Item(metadata: metadata)
            let newID = newItem.itemID

            // Store it in the contract storage
            Anique.itemDatas[newID] = newItem

            return newID
        }

        // createSet creates a new Set resource and returns it
        // so that the caller can store it in their account
        //
        // Parameters: name: The name of the set
        //
        // NOTE: series by argument?
        //
        pub fun createSet(name: String) {
            // Create the new Set
            var newSet <- create Set(name: name)

            Anique.sets[newSet.setID] <-! newSet
        }

        // borrowSet returns a reference to a set in the Anique
        // contract so that the admin can call methods on it
        //
        // Parameters: setID: The ID of the Set that you want to
        // get a reference to
        //
        // Returns: A reference to the Set with all of the fields
        // and methods exposed
        //
        pub fun borrowSet(setID: UInt32): &Set {
            pre {
                Anique.sets[setID] != nil: "Cannot borrow Set: The Set doesn't exist"
            }
            return &Anique.sets[setID] as &Set
        }

        // startNewSeries ends the current Series by incrementing
        // the Series number, meaning that Collectibles will be using the
        // new Series number from now on
        //
        // Returns: The new Series number
        //
        pub fun startNewSeries(): UInt32 {
            // end the current Series and start a new one
            // by incrementing the Anique series number
            Anique.currentSeries = Anique.currentSeries + (1 as UInt32)

            emit NewSeriesStarted(newSeries: Anique.currentSeries)

            return Anique.currentSeries
        }

        // createNewAdmin creates a new Admin resource
        //
        pub fun createNewAdmin(): @Admin {
            return <-create Admin()
        }
    }


    // -----------------------------------------------------------------------
    // Anique contract-level function definitions
    // -----------------------------------------------------------------------

    // createEmptyCollection creates a new, empty Collection object so that
    // a user can store it in their account storage.
    // Once they have a Collection in their storage, they are able to receive
    // Collectibles in transactions.
    //
    pub fun createEmptyCollection(): @NonFungibleToken.Collection {
        return <-create Anique.Collection()
    }

    // getAllItems returns all the Items in Anique
    //
    // Returns: An array of all the Items that have been created
    pub fun getAllItems(): [Anique.Item] {
        return Anique.itemDatas.values
    }

    // getItemMetaData returns all the metadata associated with a specific Item
    //
    // Parameters: itemID: The id of the Item that is being searched
    //
    // Returns: The metadata as a String to String mapping optional
    pub fun getItemMetaData(itemID: UInt32): {String: String}? {
        return self.itemDatas[itemID]?.metadata
    }

    // getItemMetaDataByField returns the metadata associated with a
    //                        specific field of the metadata
    //
    // Parameters: itemID: The id of the Item that is being searched
    //             field: The field to search for
    //
    // Returns: The metadata field as a String Optional
    pub fun getItemMetaDataByField(itemID: UInt32, field: String): String? {
        // Don't force a revert if the itemID or field is invalid
        if let item = Anique.itemDatas[itemID] {
            return item.metadata[field]
        } else {
            return nil
        }
    }

    // getSetIDsByName returns the IDs that the specified set name
    //                 is associated with.
    //
    // Parameters: setName: The name of the set that is being searched
    //
    // Returns: An array of the IDs of the set if it exists, or nil if doesn't
    pub fun getSetIDsByName(setName: String): [UInt32]? {
        var setIDs: [UInt32] = []

        // iterate through all the sets and search for the name
        for setID in Anique.sets.keys {
            let setData = Anique.SetData(setID: setID)
            if setName == setData.name {
                // if the name is found, return the ID
                setIDs.append(setData.setID)
            }
        }

        // If the name isn't found, return nil
        // Don't force a revert if the setName is invalid
        if setIDs.length == 0 {
            return nil
        } else {
            return setIDs
        }
    }

    // getNumCollectiblesInEdition return the number of Collectibles that have been
    //                        minted from a certain Set/Item.
    //
    // Parameters: setID: The id of the Set that is being searched
    //             itemID: The id of the Item that is being searched
    //
    // Returns: The total number of Collectibles
    //          that have been minted from a Set/Item
    pub fun getNumCollectiblesInSetItem(setID: UInt32, itemID: UInt32): UInt32? {
        // Don't force a revert if the set or item ID is invalid
        // remove the Set from the dictionary to get its field
        if let setToRead <- Anique.sets.remove(key: setID) {

            // read the numMintedPerItem
            let amount = setToRead.numberMintedPerItem[itemID]

            // put the set back
            Anique.sets[setID] <-! setToRead

            return amount
        } else {
            return nil
        }
    }

    // -----------------------------------------------------------------------
    // Anique initialization function
    // -----------------------------------------------------------------------
    //
    init() {
        // Initialize contract fields
        self.currentSeries = 0
        self.sets <- {}
        self.nextSetID = 1
        self.itemDatas = {}
        self.nextItemID = 1
        self.totalSupply = 0

        // Put a new Collection in storage
        self.account.save<@Collection>(<- create Collection(), to: /storage/CollectibleCollection)

        // Create a public capability for the Collection
        self.account.link<&{CollectibleCollectionPublic}>(/public/CollectibleCollection, target: /storage/CollectibleCollection)

        // Put the Admin in storage
        self.account.save<@Admin>(<- create Admin(), to: /storage/AniqueAdmin)

        emit ContractInitialized()
    }
}
