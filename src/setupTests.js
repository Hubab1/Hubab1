import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import enableHooks from 'jest-react-hooks-shallow';
import 'utils/configureYup';

configure({ adapter: new Adapter() });
enableHooks(jest, { dontMockByDefault: true });
