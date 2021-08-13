import Anique from 0xANIQUEADDRESS

// This transaction is how an Anique admin adds a created Item to a Set

// Parameters:
//
// setID: the ID of the set to which a created Item is added
// itemID: the ID of the Item being added

transaction(setID: UInt32, itemID: UInt32) {

    // Local variable for the Anique Admin object
    let adminRef: &Anique.Admin

    prepare(acct: AuthAccount) {

        // borrow a reference to the Admin resource in storage
        self.adminRef = acct.borrow<&Anique.Admin>(from: /storage/AniqueAdmin)!
    }

    execute {

        // Borrow a reference to the set to be added to
        let setRef = self.adminRef.borrowSet(setID: setID)

        // Add the specified Item ID
        setRef.addItem(itemID: itemID)
    }

    post {
        Anique.SetData(setID: setID)!.items.contains(itemID):
            "set does not contain itemID"
    }
}
