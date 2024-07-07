const { ddb_table } = process.env;

module.exports = {
  tables: [
    {
      TableName: ddb_table,
      AttributeDefinitions: [
        {
          AttributeName: "pk",
          AttributeType: "S",
        },
        {
          AttributeName: "sk",
          AttributeType: "S",
        },
      ],
      KeySchema: [
        {
          AttributeName: "pk",
          KeyType: "HASH",
        },
        {
          AttributeName: "sk",
          KeyType: "RANGE",
        },
      ],
      BillingMode: "PAY_PER_REQUEST",
    },
  ],
};
