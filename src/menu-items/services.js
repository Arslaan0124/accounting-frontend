// assets
import { ChromeOutlined, QuestionOutlined } from '@ant-design/icons';

// icons
const icons = {
    ChromeOutlined,
    QuestionOutlined
};

const support = {
    id: 'services',
    title: 'Services',
    type: 'group',
    children: [
        {
            id: 'reports',
            title: 'Reports',
            type: 'item',
            url: '/sample-page',
            icon: icons.ChromeOutlined
        },
        {
            id: 'invoices',
            title: 'Invoices',
            type: 'item',
            url: '/invoices',
            icon: icons.ChromeOutlined
        }
    ]
};

export default support;
