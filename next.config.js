module.exports = {
  experimental: {
    outputFileTracingIncludes: {
      '/api/operations/twilio/voice-sdk': [
        './node_modules/@twilio/voice-sdk/dist/twilio.min.js',
      ],
    },
  },
};
