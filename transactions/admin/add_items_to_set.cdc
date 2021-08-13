import Anique from 0xANIQUEADDRESS

// This transaction adds multiple Items to a Set

// Parameters:
//
// setID: the ID of the set to which multiple Items are added
// itemIDs: an array of Item IDs being added to the Set

transaction(setID: UInt32, itemIDs: [UInt32]) {

    // Local variable for the Anique Admin object
    let adminRef: &Anique.Admin

    prepare(acct: AuthAccount) {

        // borrow a reference to the Admin resource in storage
        self.adminRef = acct.borrow<&Anique.Admin>(from: /storage/AniqueAdmin)!
    }

    execute {

        // borrow a reference to the set to be added to
        let setRef = self.adminRef.borrowSet(setID: setID)

        // Add the specified Item IDs
        setRef.addItems(itemIDs: itemIDs)
    }
}
