export type VirtualCurve = {
  address: "virEFLZsQm1iFAs8py1XnziJ67gTzW2bfCWhxNPfccD";
  metadata: {
    name: "virtualCurve";
    version: "0.1.0";
    spec: "0.1.0";
    description: "Created with Anchor";
  };
  instructions: [
    {
      name: "claimProtocolFee";
      discriminator: [165, 228, 133, 48, 99, 249, 255, 33];
      accounts: [
        {
          name: "poolAuthority";
          pda: {
            seeds: [
              {
                kind: "const";
                value: [
                  112,
                  111,
                  111,
                  108,
                  95,
                  97,
                  117,
                  116,
                  104,
                  111,
                  114,
                  105,
                  116,
                  121
                ];
              }
            ];
          };
        },
        {
          name: "config";
          relations: ["pool"];
        },
        {
          name: "pool";
          writable: true;
        },
        {
          name: "baseVault";
          docs: ["The vault token account for input token"];
          writable: true;
          relations: ["pool"];
        },
        {
          name: "quoteVault";
          docs: ["The vault token account for output token"];
          writable: true;
          relations: ["pool"];
        },
        {
          name: "baseMint";
          docs: ["The mint of token a"];
          relations: ["pool"];
        },
        {
          name: "quoteMint";
          docs: ["The mint of token b"];
          relations: ["config"];
        },
        {
          name: "tokenBaseAccount";
          docs: ["The treasury token a account"];
          writable: true;
          pda: {
            seeds: [
              {
                kind: "const";
                value: [
                  153,
                  10,
                  107,
                  154,
                  255,
                  249,
                  210,
                  173,
                  176,
                  67,
                  220,
                  214,
                  152,
                  71,
                  46,
                  146,
                  161,
                  33,
                  81,
                  148,
                  166,
                  119,
                  5,
                  189,
                  142,
                  11,
                  57,
                  68,
                  162,
                  70,
                  126,
                  100
                ];
              },
              {
                kind: "account";
                path: "tokenBaseProgram";
              },
              {
                kind: "account";
                path: "baseMint";
              }
            ];
            program: {
              kind: "const";
              value: [
                140,
                151,
                37,
                143,
                78,
                36,
                137,
                241,
                187,
                61,
                16,
                41,
                20,
                142,
                13,
                131,
                11,
                90,
                19,
                153,
                218,
                255,
                16,
                132,
                4,
                142,
                123,
                216,
                219,
                233,
                248,
                89
              ];
            };
          };
        },
        {
          name: "tokenQuoteAccount";
          docs: ["The treasury token b account"];
          writable: true;
          pda: {
            seeds: [
              {
                kind: "const";
                value: [
                  153,
                  10,
                  107,
                  154,
                  255,
                  249,
                  210,
                  173,
                  176,
                  67,
                  220,
                  214,
                  152,
                  71,
                  46,
                  146,
                  161,
                  33,
                  81,
                  148,
                  166,
                  119,
                  5,
                  189,
                  142,
                  11,
                  57,
                  68,
                  162,
                  70,
                  126,
                  100
                ];
              },
              {
                kind: "account";
                path: "tokenQuoteProgram";
              },
              {
                kind: "account";
                path: "quoteMint";
              }
            ];
            program: {
              kind: "const";
              value: [
                140,
                151,
                37,
                143,
                78,
                36,
                137,
                241,
                187,
                61,
                16,
                41,
                20,
                142,
                13,
                131,
                11,
                90,
                19,
                153,
                218,
                255,
                16,
                132,
                4,
                142,
                123,
                216,
                219,
                233,
                248,
                89
              ];
            };
          };
        },
        {
          name: "claimFeeOperator";
          docs: ["Claim fee operator"];
        },
        {
          name: "operator";
          docs: ["Operator"];
          signer: true;
          relations: ["claimFeeOperator"];
        },
        {
          name: "tokenBaseProgram";
          docs: ["Token a program"];
        },
        {
          name: "tokenQuoteProgram";
          docs: ["Token b program"];
        },
        {
          name: "eventAuthority";
          pda: {
            seeds: [
              {
                kind: "const";
                value: [
                  95,
                  95,
                  101,
                  118,
                  101,
                  110,
                  116,
                  95,
                  97,
                  117,
                  116,
                  104,
                  111,
                  114,
                  105,
                  116,
                  121
                ];
              }
            ];
          };
        },
        {
          name: "program";
        }
      ];
      args: [];
    },
    {
      name: "claimTradingFee";
      discriminator: [8, 236, 89, 49, 152, 125, 177, 81];
      accounts: [
        {
          name: "poolAuthority";
          pda: {
            seeds: [
              {
                kind: "const";
                value: [
                  112,
                  111,
                  111,
                  108,
                  95,
                  97,
                  117,
                  116,
                  104,
                  111,
                  114,
                  105,
                  116,
                  121
                ];
              }
            ];
          };
        },
        {
          name: "config";
          relations: ["pool"];
        },
        {
          name: "pool";
          writable: true;
        },
        {
          name: "tokenAAccount";
          docs: ["The treasury token a account"];
          writable: true;
        },
        {
          name: "tokenBAccount";
          docs: ["The treasury token b account"];
          writable: true;
        },
        {
          name: "baseVault";
          docs: ["The vault token account for input token"];
          writable: true;
          relations: ["pool"];
        },
        {
          name: "quoteVault";
          docs: ["The vault token account for output token"];
          writable: true;
          relations: ["pool"];
        },
        {
          name: "baseMint";
          docs: ["The mint of token a"];
          relations: ["pool"];
        },
        {
          name: "quoteMint";
          docs: ["The mint of token b"];
          relations: ["config"];
        },
        {
          name: "feeClaimer";
          signer: true;
          relations: ["config"];
        },
        {
          name: "tokenBaseProgram";
          docs: ["Token a program"];
        },
        {
          name: "tokenQuoteProgram";
          docs: ["Token b program"];
        },
        {
          name: "eventAuthority";
          pda: {
            seeds: [
              {
                kind: "const";
                value: [
                  95,
                  95,
                  101,
                  118,
                  101,
                  110,
                  116,
                  95,
                  97,
                  117,
                  116,
                  104,
                  111,
                  114,
                  105,
                  116,
                  121
                ];
              }
            ];
          };
        },
        {
          name: "program";
        }
      ];
      args: [
        {
          name: "maxAmountA";
          type: "u64";
        },
        {
          name: "maxAmountB";
          type: "u64";
        }
      ];
    },
    {
      name: "closeClaimFeeOperator";
      discriminator: [38, 134, 82, 216, 95, 124, 17, 99];
      accounts: [
        {
          name: "claimFeeOperator";
          writable: true;
        },
        {
          name: "rentReceiver";
          writable: true;
        },
        {
          name: "admin";
          signer: true;
        },
        {
          name: "eventAuthority";
          pda: {
            seeds: [
              {
                kind: "const";
                value: [
                  95,
                  95,
                  101,
                  118,
                  101,
                  110,
                  116,
                  95,
                  97,
                  117,
                  116,
                  104,
                  111,
                  114,
                  105,
                  116,
                  121
                ];
              }
            ];
          };
        },
        {
          name: "program";
        }
      ];
      args: [];
    },
    {
      name: "createClaimFeeOperator";
      docs: ["ADMIN FUNCTIONS ////"];
      discriminator: [169, 62, 207, 107, 58, 187, 162, 109];
      accounts: [
        {
          name: "claimFeeOperator";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "const";
                value: [99, 102, 95, 111, 112, 101, 114, 97, 116, 111, 114];
              },
              {
                kind: "account";
                path: "operator";
              }
            ];
          };
        },
        {
          name: "operator";
        },
        {
          name: "admin";
          writable: true;
          signer: true;
        },
        {
          name: "systemProgram";
          address: "11111111111111111111111111111111";
        },
        {
          name: "eventAuthority";
          pda: {
            seeds: [
              {
                kind: "const";
                value: [
                  95,
                  95,
                  101,
                  118,
                  101,
                  110,
                  116,
                  95,
                  97,
                  117,
                  116,
                  104,
                  111,
                  114,
                  105,
                  116,
                  121
                ];
              }
            ];
          };
        },
        {
          name: "program";
        }
      ];
      args: [];
    },
    {
      name: "createConfig";
      docs: ["PARTNER FUNCTIONS ////"];
      discriminator: [201, 207, 243, 114, 75, 111, 47, 189];
      accounts: [
        {
          name: "config";
          writable: true;
          signer: true;
        },
        {
          name: "feeClaimer";
        },
        {
          name: "owner";
        },
        {
          name: "quoteMint";
          docs: ["quote mint"];
        },
        {
          name: "payer";
          writable: true;
          signer: true;
        },
        {
          name: "systemProgram";
          address: "11111111111111111111111111111111";
        },
        {
          name: "eventAuthority";
          pda: {
            seeds: [
              {
                kind: "const";
                value: [
                  95,
                  95,
                  101,
                  118,
                  101,
                  110,
                  116,
                  95,
                  97,
                  117,
                  116,
                  104,
                  111,
                  114,
                  105,
                  116,
                  121
                ];
              }
            ];
          };
        },
        {
          name: "program";
        }
      ];
      args: [
        {
          name: "configParameters";
          type: {
            defined: {
              name: "configParameters";
            };
          };
        }
      ];
    },
    {
      name: "creatorClaimLpFromMeteoraDynamicAmm";
      discriminator: [239, 190, 35, 36, 59, 98, 29, 26];
      accounts: [
        {
          name: "migrationMetadata";
          docs: ["presale"];
          writable: true;
        },
        {
          name: "poolAuthority";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "const";
                value: [
                  112,
                  111,
                  111,
                  108,
                  95,
                  97,
                  117,
                  116,
                  104,
                  111,
                  114,
                  105,
                  116,
                  121
                ];
              }
            ];
          };
        },
        {
          name: "pool";
          writable: true;
        },
        {
          name: "lpMint";
          relations: ["migrationMetadata"];
        },
        {
          name: "sourceToken";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "account";
                path: "poolAuthority";
              },
              {
                kind: "const";
                value: [
                  6,
                  221,
                  246,
                  225,
                  215,
                  101,
                  161,
                  147,
                  217,
                  203,
                  225,
                  70,
                  206,
                  235,
                  121,
                  172,
                  28,
                  180,
                  133,
                  237,
                  95,
                  91,
                  55,
                  145,
                  58,
                  140,
                  245,
                  133,
                  126,
                  255,
                  0,
                  169
                ];
              },
              {
                kind: "account";
                path: "migrationMetadata";
              }
            ];
            program: {
              kind: "const";
              value: [
                140,
                151,
                37,
                143,
                78,
                36,
                137,
                241,
                187,
                61,
                16,
                41,
                20,
                142,
                13,
                131,
                11,
                90,
                19,
                153,
                218,
                255,
                16,
                132,
                4,
                142,
                123,
                216,
                219,
                233,
                248,
                89
              ];
            };
          };
        },
        {
          name: "destinationToken";
          writable: true;
        },
        {
          name: "sender";
          signer: true;
        },
        {
          name: "tokenProgram";
          docs: ["tokenProgram"];
          address: "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA";
        }
      ];
      args: [];
    },
    {
      name: "initializeVirtualPoolWithSplToken";
      docs: ["POOL CREATOR FUNCTIONS ////"];
      discriminator: [140, 85, 215, 176, 102, 54, 104, 79];
      accounts: [
        {
          name: "config";
          docs: ["Which config the pool belongs to."];
        },
        {
          name: "poolAuthority";
          pda: {
            seeds: [
              {
                kind: "const";
                value: [
                  112,
                  111,
                  111,
                  108,
                  95,
                  97,
                  117,
                  116,
                  104,
                  111,
                  114,
                  105,
                  116,
                  121
                ];
              }
            ];
          };
        },
        {
          name: "creator";
        },
        {
          name: "baseMint";
          writable: true;
          signer: true;
        },
        {
          name: "quoteMint";
          relations: ["config"];
        },
        {
          name: "pool";
          docs: ["Initialize an account to store the pool state"];
          writable: true;
        },
        {
          name: "baseVault";
          docs: ["Token a vault for the pool"];
          writable: true;
          pda: {
            seeds: [
              {
                kind: "const";
                value: [116, 111, 107, 101, 110, 95, 118, 97, 117, 108, 116];
              },
              {
                kind: "account";
                path: "baseMint";
              },
              {
                kind: "account";
                path: "pool";
              }
            ];
          };
        },
        {
          name: "quoteVault";
          docs: ["Token b vault for the pool"];
          writable: true;
          pda: {
            seeds: [
              {
                kind: "const";
                value: [116, 111, 107, 101, 110, 95, 118, 97, 117, 108, 116];
              },
              {
                kind: "account";
                path: "quoteMint";
              },
              {
                kind: "account";
                path: "pool";
              }
            ];
          };
        },
        {
          name: "mintMetadata";
          writable: true;
        },
        {
          name: "metadataProgram";
          address: "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s";
        },
        {
          name: "payer";
          docs: ["Address paying to create the pool. Can be anyone"];
          writable: true;
          signer: true;
        },
        {
          name: "tokenQuoteProgram";
          docs: ["Program to create mint account and mint tokens"];
        },
        {
          name: "tokenProgram";
          address: "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA";
        },
        {
          name: "systemProgram";
          address: "11111111111111111111111111111111";
        },
        {
          name: "eventAuthority";
          pda: {
            seeds: [
              {
                kind: "const";
                value: [
                  95,
                  95,
                  101,
                  118,
                  101,
                  110,
                  116,
                  95,
                  97,
                  117,
                  116,
                  104,
                  111,
                  114,
                  105,
                  116,
                  121
                ];
              }
            ];
          };
        },
        {
          name: "program";
        }
      ];
      args: [
        {
          name: "params";
          type: {
            defined: {
              name: "initializePoolParameters";
            };
          };
        }
      ];
    },
    {
      name: "initializeVirtualPoolWithToken2022";
      discriminator: [169, 118, 51, 78, 145, 110, 220, 155];
      accounts: [
        {
          name: "config";
          docs: ["Which config the pool belongs to."];
        },
        {
          name: "poolAuthority";
          pda: {
            seeds: [
              {
                kind: "const";
                value: [
                  112,
                  111,
                  111,
                  108,
                  95,
                  97,
                  117,
                  116,
                  104,
                  111,
                  114,
                  105,
                  116,
                  121
                ];
              }
            ];
          };
        },
        {
          name: "creator";
        },
        {
          name: "baseMint";
          docs: ["Unique token mint address, initialize in contract"];
          writable: true;
          signer: true;
        },
        {
          name: "quoteMint";
          relations: ["config"];
        },
        {
          name: "pool";
          docs: ["Initialize an account to store the pool state"];
          writable: true;
        },
        {
          name: "baseVault";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "const";
                value: [116, 111, 107, 101, 110, 95, 118, 97, 117, 108, 116];
              },
              {
                kind: "account";
                path: "baseMint";
              },
              {
                kind: "account";
                path: "pool";
              }
            ];
          };
        },
        {
          name: "quoteVault";
          docs: ["Token quote vault for the pool"];
          writable: true;
          pda: {
            seeds: [
              {
                kind: "const";
                value: [116, 111, 107, 101, 110, 95, 118, 97, 117, 108, 116];
              },
              {
                kind: "account";
                path: "quoteMint";
              },
              {
                kind: "account";
                path: "pool";
              }
            ];
          };
        },
        {
          name: "payer";
          docs: ["Address paying to create the pool. Can be anyone"];
          writable: true;
          signer: true;
        },
        {
          name: "tokenQuoteProgram";
          docs: ["Program to create mint account and mint tokens"];
        },
        {
          name: "tokenProgram";
          docs: ["token program for base mint"];
          address: "TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb";
        },
        {
          name: "systemProgram";
          address: "11111111111111111111111111111111";
        },
        {
          name: "eventAuthority";
          pda: {
            seeds: [
              {
                kind: "const";
                value: [
                  95,
                  95,
                  101,
                  118,
                  101,
                  110,
                  116,
                  95,
                  97,
                  117,
                  116,
                  104,
                  111,
                  114,
                  105,
                  116,
                  121
                ];
              }
            ];
          };
        },
        {
          name: "program";
        }
      ];
      args: [
        {
          name: "params";
          type: {
            defined: {
              name: "initializePoolParameters";
            };
          };
        }
      ];
    },
    {
      name: "migrateMeteoraDamm";
      discriminator: [27, 1, 48, 22, 180, 63, 118, 217];
      accounts: [
        {
          name: "virtualPool";
          docs: ["virtual pool"];
          writable: true;
          relations: ["migrationMetadata"];
        },
        {
          name: "migrationMetadata";
          writable: true;
        },
        {
          name: "config";
          relations: ["virtualPool"];
        },
        {
          name: "poolAuthority";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "const";
                value: [
                  112,
                  111,
                  111,
                  108,
                  95,
                  97,
                  117,
                  116,
                  104,
                  111,
                  114,
                  105,
                  116,
                  121
                ];
              }
            ];
          };
        },
        {
          name: "pool";
          writable: true;
        },
        {
          name: "dammConfig";
          docs: ["pool config"];
        },
        {
          name: "lpMint";
          writable: true;
        },
        {
          name: "tokenAMint";
          writable: true;
        },
        {
          name: "tokenBMint";
        },
        {
          name: "aVault";
          writable: true;
        },
        {
          name: "bVault";
          writable: true;
        },
        {
          name: "aTokenVault";
          writable: true;
        },
        {
          name: "bTokenVault";
          writable: true;
        },
        {
          name: "aVaultLpMint";
          writable: true;
        },
        {
          name: "bVaultLpMint";
          writable: true;
        },
        {
          name: "aVaultLp";
          writable: true;
        },
        {
          name: "bVaultLp";
          writable: true;
        },
        {
          name: "baseVault";
          writable: true;
          relations: ["virtualPool"];
        },
        {
          name: "quoteVault";
          writable: true;
          relations: ["virtualPool"];
        },
        {
          name: "virtualPoolLp";
          writable: true;
        },
        {
          name: "protocolTokenAFee";
          writable: true;
        },
        {
          name: "protocolTokenBFee";
          writable: true;
        },
        {
          name: "payer";
          writable: true;
          signer: true;
        },
        {
          name: "rent";
        },
        {
          name: "mintMetadata";
          writable: true;
        },
        {
          name: "metadataProgram";
        },
        {
          name: "ammProgram";
          address: "Eo7WjKq67rjJQSZxS6z3YkapzY3eMj6Xy8X5EQVn5UaB";
        },
        {
          name: "vaultProgram";
        },
        {
          name: "tokenProgram";
          docs: ["tokenProgram"];
          address: "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA";
        },
        {
          name: "associatedTokenProgram";
        },
        {
          name: "systemProgram";
          docs: ["System program."];
          address: "11111111111111111111111111111111";
        }
      ];
      args: [];
    },
    {
      name: "migrateMeteoraDammCreatorClaimLpToken";
      discriminator: [157, 28, 113, 25, 217, 52, 255, 237];
      accounts: [
        {
          name: "migrationMetadata";
          docs: ["presale"];
          writable: true;
        },
        {
          name: "poolAuthority";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "const";
                value: [
                  112,
                  111,
                  111,
                  108,
                  95,
                  97,
                  117,
                  116,
                  104,
                  111,
                  114,
                  105,
                  116,
                  121
                ];
              }
            ];
          };
        },
        {
          name: "pool";
          writable: true;
        },
        {
          name: "lpMint";
          relations: ["migrationMetadata"];
        },
        {
          name: "sourceToken";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "account";
                path: "poolAuthority";
              },
              {
                kind: "const";
                value: [
                  6,
                  221,
                  246,
                  225,
                  215,
                  101,
                  161,
                  147,
                  217,
                  203,
                  225,
                  70,
                  206,
                  235,
                  121,
                  172,
                  28,
                  180,
                  133,
                  237,
                  95,
                  91,
                  55,
                  145,
                  58,
                  140,
                  245,
                  133,
                  126,
                  255,
                  0,
                  169
                ];
              },
              {
                kind: "account";
                path: "migrationMetadata";
              }
            ];
            program: {
              kind: "const";
              value: [
                140,
                151,
                37,
                143,
                78,
                36,
                137,
                241,
                187,
                61,
                16,
                41,
                20,
                142,
                13,
                131,
                11,
                90,
                19,
                153,
                218,
                255,
                16,
                132,
                4,
                142,
                123,
                216,
                219,
                233,
                248,
                89
              ];
            };
          };
        },
        {
          name: "destinationToken";
          writable: true;
        },
        {
          name: "sender";
          signer: true;
        },
        {
          name: "tokenProgram";
          docs: ["tokenProgram"];
          address: "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA";
        }
      ];
      args: [];
    },
    {
      name: "migrateMeteoraDammLockLpTokenForCreator";
      discriminator: [204, 196, 142, 73, 251, 226, 195, 206];
      accounts: [
        {
          name: "migrationMetadata";
          docs: ["presale"];
          writable: true;
        },
        {
          name: "poolAuthority";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "const";
                value: [
                  112,
                  111,
                  111,
                  108,
                  95,
                  97,
                  117,
                  116,
                  104,
                  111,
                  114,
                  105,
                  116,
                  121
                ];
              }
            ];
          };
        },
        {
          name: "pool";
          writable: true;
          relations: ["lockEscrow"];
        },
        {
          name: "lpMint";
          relations: ["migrationMetadata"];
        },
        {
          name: "lockEscrow";
          writable: true;
        },
        {
          name: "owner";
          relations: ["lockEscrow"];
        },
        {
          name: "sourceTokens";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "account";
                path: "poolAuthority";
              },
              {
                kind: "const";
                value: [
                  6,
                  221,
                  246,
                  225,
                  215,
                  101,
                  161,
                  147,
                  217,
                  203,
                  225,
                  70,
                  206,
                  235,
                  121,
                  172,
                  28,
                  180,
                  133,
                  237,
                  95,
                  91,
                  55,
                  145,
                  58,
                  140,
                  245,
                  133,
                  126,
                  255,
                  0,
                  169
                ];
              },
              {
                kind: "account";
                path: "migrationMetadata";
              }
            ];
            program: {
              kind: "const";
              value: [
                140,
                151,
                37,
                143,
                78,
                36,
                137,
                241,
                187,
                61,
                16,
                41,
                20,
                142,
                13,
                131,
                11,
                90,
                19,
                153,
                218,
                255,
                16,
                132,
                4,
                142,
                123,
                216,
                219,
                233,
                248,
                89
              ];
            };
          };
        },
        {
          name: "escrowVault";
          writable: true;
        },
        {
          name: "ammProgram";
          address: "Eo7WjKq67rjJQSZxS6z3YkapzY3eMj6Xy8X5EQVn5UaB";
        },
        {
          name: "aVault";
        },
        {
          name: "bVault";
        },
        {
          name: "aVaultLp";
        },
        {
          name: "bVaultLp";
        },
        {
          name: "aVaultLpMint";
        },
        {
          name: "bVaultLpMint";
        },
        {
          name: "tokenProgram";
          docs: ["tokenProgram"];
          address: "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA";
        }
      ];
      args: [];
    },
    {
      name: "migrateMeteoraDammLockLpTokenForPartner";
      discriminator: [14, 102, 240, 58, 161, 16, 166, 83];
      accounts: [
        {
          name: "migrationMetadata";
          docs: ["presale"];
          writable: true;
        },
        {
          name: "poolAuthority";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "const";
                value: [
                  112,
                  111,
                  111,
                  108,
                  95,
                  97,
                  117,
                  116,
                  104,
                  111,
                  114,
                  105,
                  116,
                  121
                ];
              }
            ];
          };
        },
        {
          name: "pool";
          writable: true;
          relations: ["lockEscrow"];
        },
        {
          name: "lpMint";
          relations: ["migrationMetadata"];
        },
        {
          name: "lockEscrow";
          writable: true;
        },
        {
          name: "owner";
          relations: ["lockEscrow"];
        },
        {
          name: "sourceTokens";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "account";
                path: "poolAuthority";
              },
              {
                kind: "const";
                value: [
                  6,
                  221,
                  246,
                  225,
                  215,
                  101,
                  161,
                  147,
                  217,
                  203,
                  225,
                  70,
                  206,
                  235,
                  121,
                  172,
                  28,
                  180,
                  133,
                  237,
                  95,
                  91,
                  55,
                  145,
                  58,
                  140,
                  245,
                  133,
                  126,
                  255,
                  0,
                  169
                ];
              },
              {
                kind: "account";
                path: "migrationMetadata";
              }
            ];
            program: {
              kind: "const";
              value: [
                140,
                151,
                37,
                143,
                78,
                36,
                137,
                241,
                187,
                61,
                16,
                41,
                20,
                142,
                13,
                131,
                11,
                90,
                19,
                153,
                218,
                255,
                16,
                132,
                4,
                142,
                123,
                216,
                219,
                233,
                248,
                89
              ];
            };
          };
        },
        {
          name: "escrowVault";
          writable: true;
        },
        {
          name: "ammProgram";
          address: "Eo7WjKq67rjJQSZxS6z3YkapzY3eMj6Xy8X5EQVn5UaB";
        },
        {
          name: "aVault";
        },
        {
          name: "bVault";
        },
        {
          name: "aVaultLp";
        },
        {
          name: "bVaultLp";
        },
        {
          name: "aVaultLpMint";
        },
        {
          name: "bVaultLpMint";
        },
        {
          name: "tokenProgram";
          docs: ["tokenProgram"];
          address: "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA";
        }
      ];
      args: [];
    },
    {
      name: "migrateMeteoraDammPartnerClaimLpToken";
      discriminator: [80, 221, 69, 196, 182, 163, 251, 90];
      accounts: [
        {
          name: "migrationMetadata";
          docs: ["presale"];
          writable: true;
        },
        {
          name: "poolAuthority";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "const";
                value: [
                  112,
                  111,
                  111,
                  108,
                  95,
                  97,
                  117,
                  116,
                  104,
                  111,
                  114,
                  105,
                  116,
                  121
                ];
              }
            ];
          };
        },
        {
          name: "pool";
          writable: true;
        },
        {
          name: "lpMint";
          relations: ["migrationMetadata"];
        },
        {
          name: "sourceToken";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "account";
                path: "poolAuthority";
              },
              {
                kind: "const";
                value: [
                  6,
                  221,
                  246,
                  225,
                  215,
                  101,
                  161,
                  147,
                  217,
                  203,
                  225,
                  70,
                  206,
                  235,
                  121,
                  172,
                  28,
                  180,
                  133,
                  237,
                  95,
                  91,
                  55,
                  145,
                  58,
                  140,
                  245,
                  133,
                  126,
                  255,
                  0,
                  169
                ];
              },
              {
                kind: "account";
                path: "migrationMetadata";
              }
            ];
            program: {
              kind: "const";
              value: [
                140,
                151,
                37,
                143,
                78,
                36,
                137,
                241,
                187,
                61,
                16,
                41,
                20,
                142,
                13,
                131,
                11,
                90,
                19,
                153,
                218,
                255,
                16,
                132,
                4,
                142,
                123,
                216,
                219,
                233,
                248,
                89
              ];
            };
          };
        },
        {
          name: "destinationToken";
          writable: true;
        },
        {
          name: "sender";
          signer: true;
        },
        {
          name: "tokenProgram";
          docs: ["tokenProgram"];
          address: "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA";
        }
      ];
      args: [];
    },
    {
      name: "migrationDammV2";
      discriminator: [156, 169, 230, 103, 53, 228, 80, 64];
      accounts: [
        {
          name: "virtualPool";
          docs: ["virtual pool"];
          writable: true;
          relations: ["migrationMetadata"];
        },
        {
          name: "migrationMetadata";
          docs: ["migration metadata"];
          writable: true;
        },
        {
          name: "config";
          docs: ["virtual pool config key"];
          relations: ["virtualPool"];
        },
        {
          name: "poolAuthority";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "const";
                value: [
                  112,
                  111,
                  111,
                  108,
                  95,
                  97,
                  117,
                  116,
                  104,
                  111,
                  114,
                  105,
                  116,
                  121
                ];
              }
            ];
          };
        },
        {
          name: "pool";
          writable: true;
        },
        {
          name: "firstPositionNftMint";
          writable: true;
        },
        {
          name: "firstPositionNftAccount";
          writable: true;
        },
        {
          name: "firstPosition";
          writable: true;
        },
        {
          name: "secondPositionNftMint";
          writable: true;
          optional: true;
        },
        {
          name: "secondPositionNftAccount";
          writable: true;
          optional: true;
        },
        {
          name: "secondPosition";
          writable: true;
          optional: true;
        },
        {
          name: "dammPoolAuthority";
        },
        {
          name: "ammProgram";
          address: "cpamdpZCGKUy5JxQXB4dcpGPiikHawvSWAd6mEn1sGG";
        },
        {
          name: "baseMint";
          writable: true;
        },
        {
          name: "quoteMint";
          writable: true;
        },
        {
          name: "tokenAVault";
          writable: true;
        },
        {
          name: "tokenBVault";
          writable: true;
        },
        {
          name: "baseVault";
          writable: true;
          relations: ["virtualPool"];
        },
        {
          name: "quoteVault";
          writable: true;
          relations: ["virtualPool"];
        },
        {
          name: "payer";
          writable: true;
          signer: true;
        },
        {
          name: "tokenBaseProgram";
        },
        {
          name: "tokenQuoteProgram";
        },
        {
          name: "token2022Program";
        },
        {
          name: "dammEventAuthority";
        },
        {
          name: "systemProgram";
          docs: ["System program."];
          address: "11111111111111111111111111111111";
        }
      ];
      args: [];
    },
    {
      name: "migrationDammV2CreateMetadata";
      discriminator: [109, 189, 19, 36, 195, 183, 222, 82];
      accounts: [
        {
          name: "virtualPool";
        },
        {
          name: "config";
          relations: ["virtualPool"];
        },
        {
          name: "migrationMetadata";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "const";
                value: [100, 97, 109, 109, 95, 118, 50];
              },
              {
                kind: "account";
                path: "virtualPool";
              }
            ];
          };
        },
        {
          name: "payer";
          writable: true;
          signer: true;
        },
        {
          name: "systemProgram";
          address: "11111111111111111111111111111111";
        },
        {
          name: "eventAuthority";
          pda: {
            seeds: [
              {
                kind: "const";
                value: [
                  95,
                  95,
                  101,
                  118,
                  101,
                  110,
                  116,
                  95,
                  97,
                  117,
                  116,
                  104,
                  111,
                  114,
                  105,
                  116,
                  121
                ];
              }
            ];
          };
        },
        {
          name: "program";
        }
      ];
      args: [];
    },
    {
      name: "migrationMeteoraDammCreateMetadata";
      docs: ["PERMISSIONLESS FUNCTIONS ///"];
      discriminator: [47, 94, 126, 115, 221, 226, 194, 133];
      accounts: [
        {
          name: "virtualPool";
        },
        {
          name: "config";
          relations: ["virtualPool"];
        },
        {
          name: "migrationMetadata";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "const";
                value: [109, 101, 116, 101, 111, 114, 97];
              },
              {
                kind: "account";
                path: "virtualPool";
              }
            ];
          };
        },
        {
          name: "payer";
          writable: true;
          signer: true;
        },
        {
          name: "systemProgram";
          address: "11111111111111111111111111111111";
        },
        {
          name: "eventAuthority";
          pda: {
            seeds: [
              {
                kind: "const";
                value: [
                  95,
                  95,
                  101,
                  118,
                  101,
                  110,
                  116,
                  95,
                  97,
                  117,
                  116,
                  104,
                  111,
                  114,
                  105,
                  116,
                  121
                ];
              }
            ];
          };
        },
        {
          name: "program";
        }
      ];
      args: [];
    },
    {
      name: "partnerClaimLpFromMeteoraDynamicAmm";
      discriminator: [245, 199, 14, 54, 241, 224, 19, 32];
      accounts: [
        {
          name: "migrationMetadata";
          docs: ["presale"];
          writable: true;
        },
        {
          name: "poolAuthority";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "const";
                value: [
                  112,
                  111,
                  111,
                  108,
                  95,
                  97,
                  117,
                  116,
                  104,
                  111,
                  114,
                  105,
                  116,
                  121
                ];
              }
            ];
          };
        },
        {
          name: "pool";
          writable: true;
        },
        {
          name: "lpMint";
          relations: ["migrationMetadata"];
        },
        {
          name: "sourceToken";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "account";
                path: "poolAuthority";
              },
              {
                kind: "const";
                value: [
                  6,
                  221,
                  246,
                  225,
                  215,
                  101,
                  161,
                  147,
                  217,
                  203,
                  225,
                  70,
                  206,
                  235,
                  121,
                  172,
                  28,
                  180,
                  133,
                  237,
                  95,
                  91,
                  55,
                  145,
                  58,
                  140,
                  245,
                  133,
                  126,
                  255,
                  0,
                  169
                ];
              },
              {
                kind: "account";
                path: "migrationMetadata";
              }
            ];
            program: {
              kind: "const";
              value: [
                140,
                151,
                37,
                143,
                78,
                36,
                137,
                241,
                187,
                61,
                16,
                41,
                20,
                142,
                13,
                131,
                11,
                90,
                19,
                153,
                218,
                255,
                16,
                132,
                4,
                142,
                123,
                216,
                219,
                233,
                248,
                89
              ];
            };
          };
        },
        {
          name: "destinationToken";
          writable: true;
        },
        {
          name: "sender";
          signer: true;
        },
        {
          name: "tokenProgram";
          docs: ["tokenProgram"];
          address: "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA";
        }
      ];
      args: [];
    },
    {
      name: "partnerWithdrawSurplus";
      discriminator: [168, 173, 72, 100, 201, 98, 38, 92];
      accounts: [
        {
          name: "poolAuthority";
          pda: {
            seeds: [
              {
                kind: "const";
                value: [
                  112,
                  111,
                  111,
                  108,
                  95,
                  97,
                  117,
                  116,
                  104,
                  111,
                  114,
                  105,
                  116,
                  121
                ];
              }
            ];
          };
        },
        {
          name: "config";
          relations: ["virtualPool"];
        },
        {
          name: "virtualPool";
          writable: true;
        },
        {
          name: "tokenQuoteAccount";
          docs: ["The receiver token account"];
          writable: true;
        },
        {
          name: "quoteVault";
          docs: ["The vault token account for output token"];
          writable: true;
          relations: ["virtualPool"];
        },
        {
          name: "quoteMint";
          docs: ["The mint of quote token"];
          relations: ["config"];
        },
        {
          name: "feeClaimer";
          signer: true;
          relations: ["config"];
        },
        {
          name: "tokenQuoteProgram";
          docs: ["Token b program"];
        },
        {
          name: "eventAuthority";
          pda: {
            seeds: [
              {
                kind: "const";
                value: [
                  95,
                  95,
                  101,
                  118,
                  101,
                  110,
                  116,
                  95,
                  97,
                  117,
                  116,
                  104,
                  111,
                  114,
                  105,
                  116,
                  121
                ];
              }
            ];
          };
        },
        {
          name: "program";
        }
      ];
      args: [];
    },
    {
      name: "protocolWithdrawSurplus";
      discriminator: [54, 136, 225, 138, 172, 182, 214, 167];
      accounts: [
        {
          name: "poolAuthority";
          pda: {
            seeds: [
              {
                kind: "const";
                value: [
                  112,
                  111,
                  111,
                  108,
                  95,
                  97,
                  117,
                  116,
                  104,
                  111,
                  114,
                  105,
                  116,
                  121
                ];
              }
            ];
          };
        },
        {
          name: "config";
          relations: ["virtualPool"];
        },
        {
          name: "virtualPool";
          writable: true;
        },
        {
          name: "tokenQuoteAccount";
          docs: ["The treasury quote token account"];
          writable: true;
          pda: {
            seeds: [
              {
                kind: "const";
                value: [
                  153,
                  10,
                  107,
                  154,
                  255,
                  249,
                  210,
                  173,
                  176,
                  67,
                  220,
                  214,
                  152,
                  71,
                  46,
                  146,
                  161,
                  33,
                  81,
                  148,
                  166,
                  119,
                  5,
                  189,
                  142,
                  11,
                  57,
                  68,
                  162,
                  70,
                  126,
                  100
                ];
              },
              {
                kind: "account";
                path: "tokenQuoteProgram";
              },
              {
                kind: "account";
                path: "quoteMint";
              }
            ];
            program: {
              kind: "const";
              value: [
                140,
                151,
                37,
                143,
                78,
                36,
                137,
                241,
                187,
                61,
                16,
                41,
                20,
                142,
                13,
                131,
                11,
                90,
                19,
                153,
                218,
                255,
                16,
                132,
                4,
                142,
                123,
                216,
                219,
                233,
                248,
                89
              ];
            };
          };
        },
        {
          name: "quoteVault";
          docs: ["The vault token account for quote token"];
          writable: true;
          relations: ["virtualPool"];
        },
        {
          name: "quoteMint";
          docs: ["The mint of of token"];
          relations: ["config"];
        },
        {
          name: "tokenQuoteProgram";
          docs: ["Token b program"];
        },
        {
          name: "eventAuthority";
          pda: {
            seeds: [
              {
                kind: "const";
                value: [
                  95,
                  95,
                  101,
                  118,
                  101,
                  110,
                  116,
                  95,
                  97,
                  117,
                  116,
                  104,
                  111,
                  114,
                  105,
                  116,
                  121
                ];
              }
            ];
          };
        },
        {
          name: "program";
        }
      ];
      args: [];
    },
    {
      name: "swap";
      docs: ["TRADING BOTS FUNCTIONS ////"];
      discriminator: [248, 198, 158, 145, 225, 117, 135, 200];
      accounts: [
        {
          name: "poolAuthority";
          pda: {
            seeds: [
              {
                kind: "const";
                value: [
                  112,
                  111,
                  111,
                  108,
                  95,
                  97,
                  117,
                  116,
                  104,
                  111,
                  114,
                  105,
                  116,
                  121
                ];
              }
            ];
          };
        },
        {
          name: "config";
          docs: ["config key"];
          relations: ["pool"];
        },
        {
          name: "pool";
          docs: ["Pool account"];
          writable: true;
        },
        {
          name: "inputTokenAccount";
          docs: ["The user token account for input token"];
          writable: true;
        },
        {
          name: "outputTokenAccount";
          docs: ["The user token account for output token"];
          writable: true;
        },
        {
          name: "baseVault";
          docs: ["The vault token account for base token"];
          writable: true;
          relations: ["pool"];
        },
        {
          name: "quoteVault";
          docs: ["The vault token account for quote token"];
          writable: true;
          relations: ["pool"];
        },
        {
          name: "baseMint";
          docs: ["The mint of base token"];
        },
        {
          name: "quoteMint";
          docs: ["The mint of quote token"];
        },
        {
          name: "payer";
          docs: ["The user performing the swap"];
          signer: true;
        },
        {
          name: "tokenBaseProgram";
          docs: ["Token base program"];
        },
        {
          name: "tokenQuoteProgram";
          docs: ["Token quote program"];
        },
        {
          name: "referralTokenAccount";
          docs: ["referral token account"];
          writable: true;
          optional: true;
        },
        {
          name: "eventAuthority";
          pda: {
            seeds: [
              {
                kind: "const";
                value: [
                  95,
                  95,
                  101,
                  118,
                  101,
                  110,
                  116,
                  95,
                  97,
                  117,
                  116,
                  104,
                  111,
                  114,
                  105,
                  116,
                  121
                ];
              }
            ];
          };
        },
        {
          name: "program";
        }
      ];
      args: [
        {
          name: "params";
          type: {
            defined: {
              name: "swapParameters";
            };
          };
        }
      ];
    }
  ];
  accounts: [
    {
      name: "claimFeeOperator";
      discriminator: [166, 48, 134, 86, 34, 200, 188, 150];
    },
    {
      name: "config";
      discriminator: [155, 12, 170, 224, 30, 250, 204, 130];
    },
    {
      name: "lockEscrow";
      discriminator: [190, 106, 121, 6, 200, 182, 21, 75];
    },
    {
      name: "meteoraDammMigrationMetadata";
      discriminator: [17, 155, 141, 215, 207, 4, 133, 156];
    },
    {
      name: "meteoraDammV2Metadata";
      discriminator: [104, 221, 219, 203, 10, 142, 250, 163];
    },
    {
      name: "poolConfig";
      discriminator: [26, 108, 14, 123, 116, 230, 129, 43];
    },
    {
      name: "virtualPool";
      discriminator: [213, 224, 5, 209, 98, 69, 119, 92];
    }
  ];
  events: [
    {
      name: "evtClaimProtocolFee";
      discriminator: [186, 244, 75, 251, 188, 13, 25, 33];
    },
    {
      name: "evtClaimTradingFee";
      discriminator: [26, 83, 117, 240, 92, 202, 112, 254];
    },
    {
      name: "evtCloseClaimFeeOperator";
      discriminator: [111, 39, 37, 55, 110, 216, 194, 23];
    },
    {
      name: "evtCreateClaimFeeOperator";
      discriminator: [21, 6, 153, 120, 68, 116, 28, 177];
    },
    {
      name: "evtCreateConfig";
      discriminator: [131, 207, 180, 174, 180, 73, 165, 54];
    },
    {
      name: "evtCreateDammV2MigrationMetadata";
      discriminator: [103, 111, 132, 168, 140, 253, 150, 114];
    },
    {
      name: "evtCreateMeteoraMigrationMetadata";
      discriminator: [99, 167, 133, 63, 214, 143, 175, 139];
    },
    {
      name: "evtCurveComplete";
      discriminator: [229, 231, 86, 84, 156, 134, 75, 24];
    },
    {
      name: "evtInitializePool";
      discriminator: [228, 50, 246, 85, 203, 66, 134, 37];
    },
    {
      name: "evtPartnerWithdrawSurplus";
      discriminator: [195, 56, 152, 9, 232, 72, 35, 22];
    },
    {
      name: "evtProtocolWithdrawSurplus";
      discriminator: [109, 111, 28, 221, 134, 195, 230, 203];
    },
    {
      name: "evtSwap";
      discriminator: [27, 60, 21, 213, 138, 170, 187, 147];
    }
  ];
  errors: [
    {
      code: 6000;
      name: "mathOverflow";
      msg: "Math operation overflow";
    },
    {
      code: 6001;
      name: "invalidFee";
      msg: "Invalid fee setup";
    },
    {
      code: 6002;
      name: "exceededSlippage";
      msg: "Exceeded slippage tolerance";
    },
    {
      code: 6003;
      name: "exceedMaxFeeBps";
      msg: "Exceeded max fee bps";
    },
    {
      code: 6004;
      name: "invalidAdmin";
      msg: "Invalid admin";
    },
    {
      code: 6005;
      name: "amountIsZero";
      msg: "Amount is zero";
    },
    {
      code: 6006;
      name: "typeCastFailed";
      msg: "Type cast error";
    },
    {
      code: 6007;
      name: "invalidActivationType";
      msg: "Invalid activation type";
    },
    {
      code: 6008;
      name: "invalidQuoteMint";
      msg: "Invalid quote mint";
    },
    {
      code: 6009;
      name: "invalidParameters";
      msg: "Invalid parameters";
    },
    {
      code: 6010;
      name: "invalidCollectFeeMode";
      msg: "Invalid collect fee mode";
    },
    {
      code: 6011;
      name: "invalidInput";
      msg: "Invalid input";
    },
    {
      code: 6012;
      name: "invalidExtension";
      msg: "Invalid extension";
    },
    {
      code: 6013;
      name: "feeInverseIsIncorrect";
      msg: "Fee inverse is incorrect";
    },
    {
      code: 6014;
      name: "notEnoughLiquidity";
      msg: "Not enough liquidity";
    },
    {
      code: 6015;
      name: "poolIsCompleted";
      msg: "Pool is completed";
    },
    {
      code: 6016;
      name: "poolIsIncompleted";
      msg: "Pool is incompleted";
    },
    {
      code: 6017;
      name: "invalidMigrationOption";
      msg: "Invalid migration option";
    },
    {
      code: 6018;
      name: "invalidTokenDecimals";
      msg: "Invalid activation type";
    },
    {
      code: 6019;
      name: "invalidTokenType";
      msg: "Invalid token type";
    },
    {
      code: 6020;
      name: "invalidFeePercentage";
      msg: "Invalid fee percentage";
    },
    {
      code: 6021;
      name: "invalidQuoteThreshold";
      msg: "Invalid quote threshold";
    },
    {
      code: 6022;
      name: "invalidCurve";
      msg: "Invalid curve";
    },
    {
      code: 6023;
      name: "notPermitToDoThisAction";
      msg: "Not permit to do this action";
    },
    {
      code: 6024;
      name: "invalidPartnerAccount";
      msg: "Invalid partner account";
    },
    {
      code: 6025;
      name: "invalidOwnerAccount";
      msg: "Invalid owner account";
    },
    {
      code: 6026;
      name: "invalidConfigAccount";
      msg: "Invalid config account";
    },
    {
      code: 6027;
      name: "surplusHasBeenWithdraw";
      msg: "Surplus has been withdraw";
    },
    {
      code: 6028;
      name: "totalBaseTokenExceedMaxSupply";
      msg: "Total base token is exceeded max supply";
    },
    {
      code: 6029;
      name: "unsupportNativeMintToken2022";
      msg: "Unsupport native mint token 2022";
    },
    {
      code: 6030;
      name: "insufficentLiquidityForMigration";
      msg: "Insufficent liquidity for migration";
    },
    {
      code: 6031;
      name: "missingPoolConfigInRemaningAccount";
      msg: "Missing pool config in remaning account";
    }
  ];
  types: [
    {
      name: "baseFeeConfig";
      serialization: "bytemuck";
      repr: {
        kind: "c";
      };
      type: {
        kind: "struct";
        fields: [
          {
            name: "cliffFeeNumerator";
            type: "u64";
          },
          {
            name: "periodFrequency";
            type: "u64";
          },
          {
            name: "reductionFactor";
            type: "u64";
          },
          {
            name: "numberOfPeriod";
            type: "u16";
          },
          {
            name: "feeSchedulerMode";
            type: "u8";
          },
          {
            name: "padding0";
            type: {
              array: ["u8", 5];
            };
          }
        ];
      };
    },
    {
      name: "baseFeeParameters";
      type: {
        kind: "struct";
        fields: [
          {
            name: "cliffFeeNumerator";
            type: "u64";
          },
          {
            name: "numberOfPeriod";
            type: "u16";
          },
          {
            name: "periodFrequency";
            type: "u64";
          },
          {
            name: "reductionFactor";
            type: "u64";
          },
          {
            name: "feeSchedulerMode";
            type: "u8";
          }
        ];
      };
    },
    {
      name: "baseFeeStruct";
      serialization: "bytemuck";
      repr: {
        kind: "c";
      };
      type: {
        kind: "struct";
        fields: [
          {
            name: "cliffFeeNumerator";
            type: "u64";
          },
          {
            name: "feeSchedulerMode";
            type: "u8";
          },
          {
            name: "padding0";
            type: {
              array: ["u8", 5];
            };
          },
          {
            name: "numberOfPeriod";
            type: "u16";
          },
          {
            name: "periodFrequency";
            type: "u64";
          },
          {
            name: "reductionFactor";
            type: "u64";
          },
          {
            name: "padding1";
            type: "u64";
          }
        ];
      };
    },
    {
      name: "claimFeeOperator";
      docs: ["Parameter that set by the protocol"];
      serialization: "bytemuck";
      repr: {
        kind: "c";
      };
      type: {
        kind: "struct";
        fields: [
          {
            name: "operator";
            docs: ["operator"];
            type: "pubkey";
          },
          {
            name: "padding";
            docs: ["Reserve"];
            type: {
              array: ["u8", 128];
            };
          }
        ];
      };
    },
    {
      name: "config";
      type: {
        kind: "struct";
        fields: [
          {
            name: "poolFees";
            type: {
              defined: {
                name: "poolFees";
              };
            };
          },
          {
            name: "activationDuration";
            type: "u64";
          },
          {
            name: "vaultConfigKey";
            type: "pubkey";
          },
          {
            name: "poolCreatorAuthority";
            type: "pubkey";
          },
          {
            name: "activationType";
            type: "u8";
          },
          {
            name: "partnerFeeNumerator";
            type: "u64";
          },
          {
            name: "padding";
            type: {
              array: ["u8", 219];
            };
          }
        ];
      };
    },
    {
      name: "configParameters";
      type: {
        kind: "struct";
        fields: [
          {
            name: "poolFees";
            type: {
              defined: {
                name: "poolFeeParamters";
              };
            };
          },
          {
            name: "collectFeeMode";
            type: "u8";
          },
          {
            name: "migrationOption";
            type: "u8";
          },
          {
            name: "activationType";
            type: "u8";
          },
          {
            name: "tokenType";
            type: "u8";
          },
          {
            name: "tokenDecimal";
            type: "u8";
          },
          {
            name: "partnerLpPercentage";
            type: "u8";
          },
          {
            name: "partnerLockedLpPercentage";
            type: "u8";
          },
          {
            name: "creatorLpPercentage";
            type: "u8";
          },
          {
            name: "creatorLockedLpPercentage";
            type: "u8";
          },
          {
            name: "migrationQuoteThreshold";
            type: "u64";
          },
          {
            name: "sqrtStartPrice";
            type: "u128";
          },
          {
            name: "padding";
            docs: ["padding for future use"];
            type: {
              array: ["u64", 6];
            };
          },
          {
            name: "curve";
            type: {
              vec: {
                defined: {
                  name: "liquidityDistributionParameters";
                };
              };
            };
          }
        ];
      };
    },
    {
      name: "dynamicFeeConfig";
      serialization: "bytemuck";
      repr: {
        kind: "c";
      };
      type: {
        kind: "struct";
        fields: [
          {
            name: "initialized";
            type: "u8";
          },
          {
            name: "padding";
            type: {
              array: ["u8", 7];
            };
          },
          {
            name: "maxVolatilityAccumulator";
            type: "u32";
          },
          {
            name: "variableFeeControl";
            type: "u32";
          },
          {
            name: "binStep";
            type: "u16";
          },
          {
            name: "filterPeriod";
            type: "u16";
          },
          {
            name: "decayPeriod";
            type: "u16";
          },
          {
            name: "reductionFactor";
            type: "u16";
          },
          {
            name: "padding2";
            type: {
              array: ["u8", 8];
            };
          },
          {
            name: "binStepU128";
            type: "u128";
          }
        ];
      };
    },
    {
      name: "dynamicFeeParameters";
      type: {
        kind: "struct";
        fields: [
          {
            name: "binStep";
            type: "u16";
          },
          {
            name: "binStepU128";
            type: "u128";
          },
          {
            name: "filterPeriod";
            type: "u16";
          },
          {
            name: "decayPeriod";
            type: "u16";
          },
          {
            name: "reductionFactor";
            type: "u16";
          },
          {
            name: "maxVolatilityAccumulator";
            type: "u32";
          },
          {
            name: "variableFeeControl";
            type: "u32";
          }
        ];
      };
    },
    {
      name: "dynamicFeeStruct";
      serialization: "bytemuck";
      repr: {
        kind: "c";
      };
      type: {
        kind: "struct";
        fields: [
          {
            name: "initialized";
            type: "u8";
          },
          {
            name: "padding";
            type: {
              array: ["u8", 7];
            };
          },
          {
            name: "maxVolatilityAccumulator";
            type: "u32";
          },
          {
            name: "variableFeeControl";
            type: "u32";
          },
          {
            name: "binStep";
            type: "u16";
          },
          {
            name: "filterPeriod";
            type: "u16";
          },
          {
            name: "decayPeriod";
            type: "u16";
          },
          {
            name: "reductionFactor";
            type: "u16";
          },
          {
            name: "lastUpdateTimestamp";
            type: "u64";
          },
          {
            name: "binStepU128";
            type: "u128";
          },
          {
            name: "sqrtPriceReference";
            type: "u128";
          },
          {
            name: "volatilityAccumulator";
            type: "u128";
          },
          {
            name: "volatilityReference";
            type: "u128";
          }
        ];
      };
    },
    {
      name: "evtClaimProtocolFee";
      type: {
        kind: "struct";
        fields: [
          {
            name: "pool";
            type: "pubkey";
          },
          {
            name: "tokenBaseAmount";
            type: "u64";
          },
          {
            name: "tokenQuoteAmount";
            type: "u64";
          }
        ];
      };
    },
    {
      name: "evtClaimTradingFee";
      type: {
        kind: "struct";
        fields: [
          {
            name: "pool";
            type: "pubkey";
          },
          {
            name: "tokenBaseAmount";
            type: "u64";
          },
          {
            name: "tokenQuoteAmount";
            type: "u64";
          }
        ];
      };
    },
    {
      name: "evtCloseClaimFeeOperator";
      docs: ["Close claim fee operator"];
      type: {
        kind: "struct";
        fields: [
          {
            name: "claimFeeOperator";
            type: "pubkey";
          },
          {
            name: "operator";
            type: "pubkey";
          }
        ];
      };
    },
    {
      name: "evtCreateClaimFeeOperator";
      docs: ["Create claim fee operator"];
      type: {
        kind: "struct";
        fields: [
          {
            name: "operator";
            type: "pubkey";
          }
        ];
      };
    },
    {
      name: "evtCreateConfig";
      docs: ["Create config"];
      type: {
        kind: "struct";
        fields: [
          {
            name: "config";
            type: "pubkey";
          },
          {
            name: "quoteMint";
            type: "pubkey";
          },
          {
            name: "feeClaimer";
            type: "pubkey";
          },
          {
            name: "owner";
            type: "pubkey";
          },
          {
            name: "poolFees";
            type: {
              defined: {
                name: "poolFeeParamters";
              };
            };
          },
          {
            name: "collectFeeMode";
            type: "u8";
          },
          {
            name: "migrationOption";
            type: "u8";
          },
          {
            name: "activationType";
            type: "u8";
          },
          {
            name: "tokenDecimal";
            type: "u8";
          },
          {
            name: "tokenType";
            type: "u8";
          },
          {
            name: "partnerLockedLpPercentage";
            type: "u8";
          },
          {
            name: "partnerLpPercentage";
            type: "u8";
          },
          {
            name: "creatorLockedLpPercentage";
            type: "u8";
          },
          {
            name: "creatorLpPercentage";
            type: "u8";
          },
          {
            name: "swapBaseAmount";
            type: "u64";
          },
          {
            name: "migrationQuoteThreshold";
            type: "u64";
          },
          {
            name: "migrationBaseAmount";
            type: "u64";
          },
          {
            name: "sqrtStartPrice";
            type: "u128";
          },
          {
            name: "curve";
            type: {
              vec: {
                defined: {
                  name: "liquidityDistributionParameters";
                };
              };
            };
          }
        ];
      };
    },
    {
      name: "evtCreateDammV2MigrationMetadata";
      type: {
        kind: "struct";
        fields: [
          {
            name: "virtualPool";
            type: "pubkey";
          }
        ];
      };
    },
    {
      name: "evtCreateMeteoraMigrationMetadata";
      type: {
        kind: "struct";
        fields: [
          {
            name: "virtualPool";
            type: "pubkey";
          }
        ];
      };
    },
    {
      name: "evtCurveComplete";
      type: {
        kind: "struct";
        fields: [
          {
            name: "pool";
            type: "pubkey";
          },
          {
            name: "config";
            type: "pubkey";
          },
          {
            name: "baseReserve";
            type: "u64";
          },
          {
            name: "quoteReserve";
            type: "u64";
          }
        ];
      };
    },
    {
      name: "evtInitializePool";
      type: {
        kind: "struct";
        fields: [
          {
            name: "pool";
            type: "pubkey";
          },
          {
            name: "config";
            type: "pubkey";
          },
          {
            name: "creator";
            type: "pubkey";
          },
          {
            name: "baseMint";
            type: "pubkey";
          },
          {
            name: "poolType";
            type: "u8";
          },
          {
            name: "activationPoint";
            type: "u64";
          }
        ];
      };
    },
    {
      name: "evtPartnerWithdrawSurplus";
      type: {
        kind: "struct";
        fields: [
          {
            name: "pool";
            type: "pubkey";
          },
          {
            name: "surplusAmount";
            type: "u64";
          }
        ];
      };
    },
    {
      name: "evtProtocolWithdrawSurplus";
      type: {
        kind: "struct";
        fields: [
          {
            name: "pool";
            type: "pubkey";
          },
          {
            name: "surplusAmount";
            type: "u64";
          }
        ];
      };
    },
    {
      name: "evtSwap";
      type: {
        kind: "struct";
        fields: [
          {
            name: "pool";
            type: "pubkey";
          },
          {
            name: "config";
            type: "pubkey";
          },
          {
            name: "tradeDirection";
            type: "u8";
          },
          {
            name: "hasReferral";
            type: "bool";
          },
          {
            name: "params";
            type: {
              defined: {
                name: "swapParameters";
              };
            };
          },
          {
            name: "swapResult";
            type: {
              defined: {
                name: "swapResult";
              };
            };
          },
          {
            name: "transferFeeExcludedAmountIn";
            type: "u64";
          },
          {
            name: "currentTimestamp";
            type: "u64";
          }
        ];
      };
    },
    {
      name: "initializePoolParameters";
      type: {
        kind: "struct";
        fields: [
          {
            name: "name";
            type: "string";
          },
          {
            name: "symbol";
            type: "string";
          },
          {
            name: "uri";
            type: "string";
          }
        ];
      };
    },
    {
      name: "liquidityDistributionConfig";
      serialization: "bytemuck";
      repr: {
        kind: "c";
      };
      type: {
        kind: "struct";
        fields: [
          {
            name: "sqrtPrice";
            type: "u128";
          },
          {
            name: "liquidity";
            type: "u128";
          }
        ];
      };
    },
    {
      name: "liquidityDistributionParameters";
      type: {
        kind: "struct";
        fields: [
          {
            name: "sqrtPrice";
            type: "u128";
          },
          {
            name: "liquidity";
            type: "u128";
          }
        ];
      };
    },
    {
      name: "lockEscrow";
      docs: ["State of lock escrow account"];
      type: {
        kind: "struct";
        fields: [
          {
            name: "pool";
            type: "pubkey";
          },
          {
            name: "owner";
            type: "pubkey";
          },
          {
            name: "escrowVault";
            type: "pubkey";
          },
          {
            name: "bump";
            type: "u8";
          },
          {
            name: "totalLockedAmount";
            type: "u64";
          },
          {
            name: "lpPerToken";
            type: "u128";
          },
          {
            name: "unclaimedFeePending";
            type: "u64";
          },
          {
            name: "aFee";
            type: "u64";
          },
          {
            name: "bFee";
            type: "u64";
          }
        ];
      };
    },
    {
      name: "meteoraDammMigrationMetadata";
      serialization: "bytemuck";
      repr: {
        kind: "c";
      };
      type: {
        kind: "struct";
        fields: [
          {
            name: "virtualPool";
            docs: ["pool"];
            type: "pubkey";
          },
          {
            name: "poolCreator";
            docs: ["pool creator"];
            type: "pubkey";
          },
          {
            name: "partner";
            docs: ["partner"];
            type: "pubkey";
          },
          {
            name: "lpMint";
            docs: ["lp mint"];
            type: "pubkey";
          },
          {
            name: "partnerLockedLp";
            docs: ["partner locked lp"];
            type: "u64";
          },
          {
            name: "partnerLp";
            docs: ["partner lp"];
            type: "u64";
          },
          {
            name: "creatorLockedLp";
            docs: ["creator locked lp"];
            type: "u64";
          },
          {
            name: "creatorLp";
            docs: ["creator lp"];
            type: "u64";
          },
          {
            name: "progress";
            docs: ["progress"];
            type: "u8";
          },
          {
            name: "creatorLockedStatus";
            docs: ["flag to check whether lp is locked for creator"];
            type: "u8";
          },
          {
            name: "partnerLockedStatus";
            docs: ["flag to check whether lp is locked for partner"];
            type: "u8";
          },
          {
            name: "creatorClaimStatus";
            docs: ["flag to check whether creator has claimed lp token"];
            type: "u8";
          },
          {
            name: "partnerClaimStatus";
            docs: ["flag to check whether partner has claimed lp token"];
            type: "u8";
          },
          {
            name: "padding";
            docs: ["Reserve"];
            type: {
              array: ["u8", 107];
            };
          }
        ];
      };
    },
    {
      name: "meteoraDammV2Metadata";
      serialization: "bytemuck";
      repr: {
        kind: "c";
      };
      type: {
        kind: "struct";
        fields: [
          {
            name: "virtualPool";
            docs: ["pool"];
            type: "pubkey";
          },
          {
            name: "poolCreator";
            docs: ["pool creator"];
            type: "pubkey";
          },
          {
            name: "partner";
            docs: ["partner"];
            type: "pubkey";
          },
          {
            name: "progress";
            docs: ["progress"];
            type: "u8";
          },
          {
            name: "padding";
            docs: ["Reserve"];
            type: {
              array: ["u8", 125];
            };
          }
        ];
      };
    },
    {
      name: "poolConfig";
      serialization: "bytemuck";
      repr: {
        kind: "c";
      };
      type: {
        kind: "struct";
        fields: [
          {
            name: "quoteMint";
            docs: ["quote mint"];
            type: "pubkey";
          },
          {
            name: "feeClaimer";
            docs: ["Address to get the fee"];
            type: "pubkey";
          },
          {
            name: "owner";
            docs: ["Owner of that config key"];
            type: "pubkey";
          },
          {
            name: "poolFees";
            docs: ["Pool fee"];
            type: {
              defined: {
                name: "poolFeesConfig";
              };
            };
          },
          {
            name: "collectFeeMode";
            docs: ["Collect fee mode"];
            type: "u8";
          },
          {
            name: "migrationOption";
            docs: ["migration option"];
            type: "u8";
          },
          {
            name: "activationType";
            docs: ["whether mode slot or timestamp"];
            type: "u8";
          },
          {
            name: "tokenDecimal";
            docs: ["token decimals"];
            type: "u8";
          },
          {
            name: "version";
            docs: ["version"];
            type: "u8";
          },
          {
            name: "tokenType";
            docs: ["token type of base token"];
            type: "u8";
          },
          {
            name: "quoteTokenFlag";
            docs: ["quote token flag"];
            type: "u8";
          },
          {
            name: "partnerLockedLpPercentage";
            docs: ["partner locked lp percentage"];
            type: "u8";
          },
          {
            name: "partnerLpPercentage";
            docs: ["partner lp percentage"];
            type: "u8";
          },
          {
            name: "creatorLockedLpPercentage";
            docs: ["creator post migration fee percentage"];
            type: "u8";
          },
          {
            name: "creatorLpPercentage";
            docs: ["creator lp percentage"];
            type: "u8";
          },
          {
            name: "padding0";
            docs: ["padding 0"];
            type: {
              array: ["u8", 5];
            };
          },
          {
            name: "padding1";
            docs: ["padding 1"];
            type: {
              array: ["u8", 8];
            };
          },
          {
            name: "swapBaseAmount";
            docs: ["swap base amount"];
            type: "u64";
          },
          {
            name: "migrationQuoteThreshold";
            docs: ["migration quote threshold (in quote token)"];
            type: "u64";
          },
          {
            name: "migrationBaseThreshold";
            docs: ["migration base threshold (in base token)"];
            type: "u64";
          },
          {
            name: "migrationSqrtPrice";
            docs: ["migration sqrt price"];
            type: "u128";
          },
          {
            name: "padding2";
            docs: ["padding 2"];
            type: {
              array: ["u128", 6];
            };
          },
          {
            name: "sqrtStartPrice";
            docs: ["minimum price"];
            type: "u128";
          },
          {
            name: "curve";
            docs: [
              "curve, only use 20 point firstly, we can extend that latter"
            ];
            type: {
              array: [
                {
                  defined: {
                    name: "liquidityDistributionConfig";
                  };
                },
                20
              ];
            };
          }
        ];
      };
    },
    {
      name: "poolFeeParamters";
      docs: ["Information regarding fee charges"];
      type: {
        kind: "struct";
        fields: [
          {
            name: "baseFee";
            docs: ["Base fee"];
            type: {
              defined: {
                name: "baseFeeParameters";
              };
            };
          },
          {
            name: "dynamicFee";
            docs: ["dynamic fee"];
            type: {
              option: {
                defined: {
                  name: "dynamicFeeParameters";
                };
              };
            };
          }
        ];
      };
    },
    {
      name: "poolFees";
      docs: ["Information regarding fee charges"];
      type: {
        kind: "struct";
        fields: [
          {
            name: "tradeFeeNumerator";
            type: "u64";
          },
          {
            name: "tradeFeeDenominator";
            type: "u64";
          },
          {
            name: "protocolTradeFeeNumerator";
            type: "u64";
          },
          {
            name: "protocolTradeFeeDenominator";
            type: "u64";
          }
        ];
      };
    },
    {
      name: "poolFeesConfig";
      serialization: "bytemuck";
      repr: {
        kind: "c";
      };
      type: {
        kind: "struct";
        fields: [
          {
            name: "baseFee";
            type: {
              defined: {
                name: "baseFeeConfig";
              };
            };
          },
          {
            name: "dynamicFee";
            type: {
              defined: {
                name: "dynamicFeeConfig";
              };
            };
          },
          {
            name: "padding0";
            type: {
              array: ["u64", 5];
            };
          },
          {
            name: "padding1";
            type: {
              array: ["u8", 6];
            };
          },
          {
            name: "protocolFeePercent";
            type: "u8";
          },
          {
            name: "referralFeePercent";
            type: "u8";
          }
        ];
      };
    },
    {
      name: "poolFeesStruct";
      docs: [
        "Information regarding fee charges",
        "trading_fee = amount * trade_fee_numerator / denominator",
        "protocol_fee = trading_fee * protocol_fee_percentage / 100",
        "referral_fee = protocol_fee * referral_percentage / 100",
        "partner_fee = trading_fee - protocol_fee - referral_fee"
      ];
      serialization: "bytemuck";
      repr: {
        kind: "c";
      };
      type: {
        kind: "struct";
        fields: [
          {
            name: "baseFee";
            docs: [
              "Trade fees are extra token amounts that are held inside the token",
              "accounts during a trade, making the value of liquidity tokens rise.",
              "Trade fee numerator"
            ];
            type: {
              defined: {
                name: "baseFeeStruct";
              };
            };
          },
          {
            name: "protocolFeePercent";
            docs: [
              "Protocol trading fees are extra token amounts that are held inside the token",
              "accounts during a trade, with the equivalent in pool tokens minted to",
              "the protocol of the program.",
              "Protocol trade fee numerator"
            ];
            type: "u8";
          },
          {
            name: "referralFeePercent";
            docs: ["referral fee"];
            type: "u8";
          },
          {
            name: "padding0";
            docs: ["padding"];
            type: {
              array: ["u8", 6];
            };
          },
          {
            name: "dynamicFee";
            docs: ["dynamic fee"];
            type: {
              defined: {
                name: "dynamicFeeStruct";
              };
            };
          },
          {
            name: "padding1";
            docs: ["padding"];
            type: {
              array: ["u64", 2];
            };
          }
        ];
      };
    },
    {
      name: "poolMetrics";
      serialization: "bytemuck";
      repr: {
        kind: "c";
      };
      type: {
        kind: "struct";
        fields: [
          {
            name: "totalProtocolBaseFee";
            type: "u64";
          },
          {
            name: "totalProtocolQuoteFee";
            type: "u64";
          },
          {
            name: "totalTradingBaseFee";
            type: "u64";
          },
          {
            name: "totalTradingQuoteFee";
            type: "u64";
          }
        ];
      };
    },
    {
      name: "swapParameters";
      type: {
        kind: "struct";
        fields: [
          {
            name: "amountIn";
            type: "u64";
          },
          {
            name: "minimumAmountOut";
            type: "u64";
          }
        ];
      };
    },
    {
      name: "swapResult";
      docs: ["Encodes all results of swapping"];
      type: {
        kind: "struct";
        fields: [
          {
            name: "actualInputAmount";
            type: "u64";
          },
          {
            name: "outputAmount";
            type: "u64";
          },
          {
            name: "nextSqrtPrice";
            type: "u128";
          },
          {
            name: "tradingFee";
            type: "u64";
          },
          {
            name: "protocolFee";
            type: "u64";
          },
          {
            name: "referralFee";
            type: "u64";
          }
        ];
      };
    },
    {
      name: "virtualPool";
      serialization: "bytemuck";
      repr: {
        kind: "c";
      };
      type: {
        kind: "struct";
        fields: [
          {
            name: "poolFees";
            docs: ["Pool fee"];
            type: {
              defined: {
                name: "poolFeesStruct";
              };
            };
          },
          {
            name: "config";
            docs: ["config key"];
            type: "pubkey";
          },
          {
            name: "creator";
            docs: ["creator"];
            type: "pubkey";
          },
          {
            name: "baseMint";
            docs: ["base mint"];
            type: "pubkey";
          },
          {
            name: "baseVault";
            docs: ["base vault"];
            type: "pubkey";
          },
          {
            name: "quoteVault";
            docs: ["quote vault"];
            type: "pubkey";
          },
          {
            name: "baseReserve";
            docs: ["base reserve"];
            type: "u64";
          },
          {
            name: "quoteReserve";
            docs: ["quote reserve"];
            type: "u64";
          },
          {
            name: "protocolBaseFee";
            docs: ["protocol base fee"];
            type: "u64";
          },
          {
            name: "protocolQuoteFee";
            docs: ["protocol quote fee"];
            type: "u64";
          },
          {
            name: "tradingBaseFee";
            docs: ["trading base fee"];
            type: "u64";
          },
          {
            name: "tradingQuoteFee";
            docs: ["trading quote fee"];
            type: "u64";
          },
          {
            name: "sqrtPrice";
            docs: ["current price"];
            type: "u128";
          },
          {
            name: "activationPoint";
            docs: ["Activation point"];
            type: "u64";
          },
          {
            name: "poolType";
            docs: ["pool type, spl token or token2022"];
            type: "u8";
          },
          {
            name: "isMigrated";
            docs: ["is migrated"];
            type: "u8";
          },
          {
            name: "isPartnerWithdrawSurplus";
            docs: ["is partner withdraw surplus"];
            type: "u8";
          },
          {
            name: "isProcotolWithdrawSurplus";
            docs: ["is protocol withdraw surplus"];
            type: "u8";
          },
          {
            name: "padding0";
            docs: ["padding"];
            type: {
              array: ["u8", 4];
            };
          },
          {
            name: "metrics";
            docs: ["pool metrics"];
            type: {
              defined: {
                name: "poolMetrics";
              };
            };
          },
          {
            name: "padding1";
            docs: ["Padding for further use"];
            type: {
              array: ["u64", 10];
            };
          }
        ];
      };
    }
  ];
};
