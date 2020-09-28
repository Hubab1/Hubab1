import HelloSign from 'hellosign-embedded';
import { HELLOSIGN_CLIENT_ID } from 'app/constants';

export default new HelloSign({
    clientId: HELLOSIGN_CLIENT_ID,
});
