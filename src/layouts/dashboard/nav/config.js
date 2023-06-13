// component
import SvgColor from '../../../components/svg-color';

// ----------------------------------------------------------------------

const icon = (name) => <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />;

const navConfig = [
  {
    title: 'dashboard',
    path: '/dashboard/app',
    icon: icon('ic_analytics'),
  },
  {
    title: 'pedidos',
    path: '/dashboard/orders',
    icon: icon('ic_user'),
  },
  {
    title: 'cerrar sesión',
    path: '/',
    icon: icon('ic_lock'),
  },
];

export default navConfig;
