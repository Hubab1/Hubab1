import { HELLOSIGN_CLIENT_ID } from 'config';
import HelloSign from 'hellosign-embedded';

export default new HelloSign({
    clientId: HELLOSIGN_CLIENT_ID,
});
