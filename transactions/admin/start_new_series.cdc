import Anique from 0xANIQUEADDRESS

// This transaction is for an Admin to start a new Anique series

transaction {

    // Local variable for the Anique Admin object
    let adminRef: &Anique.Admin
    let currentSeries: UInt32

    prepare(acct: AuthAccount) {

        // borrow a reference to the Admin resource in storage
        self.adminRef = acct.borrow<&Anique.Admin>(from: /storage/AniqueAdmin)!

        self.currentSeries = Anique.currentSeries
    }

    execute {
        // Increment the series number
        self.adminRef.startNewSeries()
    }

    post {
        Anique.currentSeries == self.currentSeries + 1 as UInt32:
            "new series not started"
    }
}
