const helloWorldResolvers = {
  Query: {
    hello: () => {
      return 'Hello world!';
    },
  },
};

exports.helloWorldResolvers = helloWorldResolvers;
