// assets
import { ChromeOutlined, QuestionOutlined, SkinOutlined, FormOutlined } from '@ant-design/icons';

// icons
const icons = {
    ChromeOutlined,
    QuestionOutlined,
    FormOutlined,
    SkinOutlined
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
            icon: icons.FormOutlined
        },
        {
            id: 'items',
            title: 'Items',
            type: 'item',
            url: '/items',
            icon: icons.SkinOutlined
        }
    ]
};

export default support;
