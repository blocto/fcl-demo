import Anique from 0xANIQUEADDRESS

// This transaction is for the admin to create a new Set resource
// and store it in the Anique smart contract

// Parameters:
//
// setName: the name of a new Set to be created

transaction(setName: String) {

    // Local variable for the Anique Admin object
    let adminRef: &Anique.Admin
    let currSetID: UInt32

    prepare(acct: AuthAccount) {

        // borrow a reference to the Admin resource in storage
        self.adminRef = acct.borrow<&Anique.Admin>(from: /storage/AniqueAdmin)!
        self.currSetID = Anique.nextSetID;
    }

    execute {
        // Create a set with the specified name
        self.adminRef.createSet(name: setName)
    }

    post {
        Anique.SetData(setID: self.currSetID).name == setName:
          "Could not find the specified Set"
    }
}
