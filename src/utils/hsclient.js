import HelloSign from 'hellosign-embedded';

export default new HelloSign({
    clientId: process.env.HELLOSIGN_CLIENT_ID,
});
