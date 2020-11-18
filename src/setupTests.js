import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import 'utils/configureYup';

configure({adapter: new Adapter()});
