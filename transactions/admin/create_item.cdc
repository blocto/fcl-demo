import Anique from 0xANIQUEADDRESS

// This transaction creates a new Item struct
// and stores it in the Anique smart contract
// We currently stringify the metadata and insert it into the
// transaction string, but want to use transaction arguments soon

transaction(metadata: {String: String}) {
    // local variable for the admin reference
    let adminRef: &Anique.Admin

    prepare(account: AuthAccount) {

        // borrow a reference to the admin resource
        self.adminRef = account.borrow<&Anique.Admin>(from: /storage/AniqueAdmin)!
    }

    execute {
        self.adminRef.createItem(metadata: metadata)
    }
}
