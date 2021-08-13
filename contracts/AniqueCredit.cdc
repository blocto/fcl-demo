// AniqueCredit.cdc
//
// The FungibleToken contract is a sample implementation of a fungible token on Flow.
//
// Fungible tokens behave like everyday currencies -- they can be minted, transferred or
// traded for digital goods.
//
// Follow the fungible tokens tutorial to learn more: https://docs.onflow.org/docs/fungible-tokens
import Anique from 0xd284f03bf25ea331

pub contract AniqueCredit {

    // Total supply of all tokens in existence.
    pub var totalSupply: UFix64

    /// TokensInitialized
    ///
    /// The event that is emitted when the contract is created
    ///
    pub event TokensInitialized(initialSupply: UFix64)

    /// TokensWithdrawn
    ///
    /// The event that is emitted when tokens are withdrawn from a Vault
    ///
    pub event TokensWithdrawn(amount: UFix64, from: Address?)

    /// TokensDeposited
    ///
    /// The event that is emitted when tokens are deposited into a Vault
    ///
    pub event TokensDeposited(amount: UFix64, to: Address?)

    pub resource interface Provider {
        pub fun withdraw(amount: UFix64, admin: &Anique.Admin): @Vault {
            post {
                // `result` refers to the return value of the function
                result.balance == UFix64(amount):
                    "Withdrawal amount must be the same as the balance of the withdrawn Vault"
                admin != nil:
                    "admin must be set"
            }
        }
    }

    pub resource interface Receiver {
        pub fun deposit(from: @Vault)
    }

    pub resource interface Balance {
        pub var balance: UFix64
    }

    pub resource Vault: Provider, Receiver, Balance {

        pub var balance: UFix64

        // initialize the balance at resource creation time
        init(balance: UFix64) {
            self.balance = balance
        }

        // withdraw
        pub fun withdraw(amount: UFix64, admin: &Anique.Admin): @Vault {
            self.balance = self.balance - amount
            emit TokensWithdrawn(amount: amount, from: self.owner?.address)
            return <-create Vault(balance: amount)
        }

        // deposit
        pub fun deposit(from: @Vault) {
            self.balance = self.balance + from.balance
            emit TokensDeposited(amount: from.balance, to: self.owner?.address)
            destroy from
        }
    }

    pub fun createEmptyVault(): @Vault {
        return <-create Vault(balance: 0.0)
    }

    // VaultMinter
    //
    // Resource object that an admin can control to mint new tokens
    pub resource VaultMinter {

        // Function that mints new tokens and deposits into an account's vault
        // using their `Receiver` reference.
        // We say `&AnyResource{Receiver}` to say that the recipient can be any resource
        // as long as it implements the Receiver interface
        pub fun mintTokens(amount: UFix64, recipient: &AnyResource{Receiver}) {
            AniqueCredit.totalSupply = AniqueCredit.totalSupply + amount
            recipient.deposit(from: <-create Vault(balance: amount))
        }
    }

    // The init function for the contract. All fields in the contract must
    // be initialized at deployment. This is just an example of what
    // an implementation could do in the init function. The numbers are arbitrary.
    init() {
        self.totalSupply = 0.0

        let vault <- create Vault(balance: self.totalSupply)
        self.account.save(<-vault, to: /storage/AniqueCreditVault)

        self.account.link<&Vault{Receiver, Balance}>(/public/AniqueCreditReceiver, target: /storage/AniqueCreditVault)

        self.account.save(<-create VaultMinter(), to: /storage/AniqueCreditMinter)

        self.account.link<&VaultMinter>(/private/AniqueCreditMinter, target: /storage/AniqueCreditMinter)

        emit TokensInitialized(initialSupply: self.totalSupply)
    }
}
