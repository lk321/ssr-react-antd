import Home from './Home';
import Activation from './containers/activation';
import NotFound from './NotFound';

import loadData from './helpers/loadData';

const Routes = [
    {
        path: '/',
        exact: true,
        component: Home
    },
    {
        path: '/activation',
        component: Activation,
        loadData: () => loadData('todos')
    },
    {
        component: NotFound
    }
];

export default Routes;