import Amplify from 'aws-amplify';

Amplify.configure({
  Auth: {
    region: 'us-west-2', // 🔁 Replace with your actual region
    userPoolId: 'us-west-2_E1Tu9uEDB', // 🔁 Replace with your actual User Pool ID
    userPoolWebClientId: '4l5uvhbdggts79arfr4t94v8fb', // 🔁 Replace with your actual App Client ID
  },
});
