import Vue from 'vue'

// 按需加载
import {
    Upload,
    Button,
    Form,
    FormItem,
    Input,
    Image,
    Dropdown,
    DropdownMenu,
    DropdownItem,
    Avatar,
    Pagination,
    Dialog,
    Carousel,
    CarouselItem,
    Tooltip,
    Select,
    Option,
    Table,
    TableColumn,
    Switch,
    Link,
    InputNumber,
    Radio,
    RadioGroup,
    Loading,
    Message,
    Notification,
    Backtop,
    Icon
} from 'element-ui'



export default () => {
    Vue.use(Upload)
    Vue.use(Button)
    Vue.use(Form)
    Vue.use(FormItem)
    Vue.use(Input)
    Vue.use(Image)
    Vue.use(Dropdown)
    Vue.use(DropdownMenu)
    Vue.use(DropdownItem)
    Vue.use(Avatar)
    Vue.use(Pagination)
    Vue.use(Dialog)
    Vue.use(Carousel)
    Vue.use(CarouselItem)
    Vue.use(Tooltip)
    Vue.use(Select)
    Vue.use(Option)
    Vue.use(Table)
    Vue.use(TableColumn)
    Vue.use(Switch)
    Vue.use(Link)
    Vue.use(InputNumber)
    Vue.use(Radio)
    Vue.use(RadioGroup)
    Vue.use(Backtop)
    Vue.use(Icon)
    Vue.use(Loading.directive);
    Vue.prototype.$message = Message
    Vue.prototype.$notify = Notification;
}