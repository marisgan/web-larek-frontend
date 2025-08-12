import { API_URL, CDN_URL } from './utils/constants'
import './scss/styles.scss';
import { WebLarekApi } from './components/WebLarekApi';
import { EventEmitter } from './components/base/events';
import { CatalogModel } from './components/models/CatalogModel';
import { BasketModel } from './components/models/BasketModel';
import { Card, IBuyButton } from './components/views/Card';
import { cloneTemplate, createElement } from './utils/utils';
import { CatalogView} from './components/views/CatalogView';
import { Header } from './components/views/Header';
import { IItem } from './types';
import { IModal, Modal } from './components/views/Modal';
import { BasketView, IBasketView } from './components/views/BasketView';
import { buyButtonSettings } from './utils/constants';
import { UserModel, TPaymentMethod, IUserInfo } from './components/models/UserModel';
import { IOrderForm, OrderForm } from './components/views/OrderForm';
import { Success } from './components/views/Success';
import { ContactsForm, IContactsForm } from './components/views/ContactsForm';


const api = new WebLarekApi(API_URL, CDN_URL);
const events = new EventEmitter();

const catalogModel = new CatalogModel(events);
const basketModel = new BasketModel(events);
const userModel = new UserModel(events);

const cardCatalogTemplate = document.querySelector('#card-catalog') as HTMLTemplateElement;
const cardPreviewTemplate = document.querySelector('#card-preview') as HTMLTemplateElement;
const cardBasketTemplate = document.querySelector('#card-basket') as HTMLTemplateElement;
const basketTemplate = document.querySelector('#basket') as HTMLTemplateElement;
const orderFormTemplate = document.querySelector('#order') as HTMLTemplateElement;
const contactsFormTemplate = document.querySelector('#contacts') as HTMLTemplateElement;
const successTemplate = document.querySelector('#success') as HTMLTemplateElement;

const headerContainer = document.querySelector('.header') as HTMLElement;
const catalogContainer = document.querySelector('.gallery') as HTMLElement;
const modalContainer = document.querySelector('.modal') as HTMLElement;

const catalogView = new CatalogView(catalogContainer, events);
const header = new Header(headerContainer, events);
const modal = new Modal(modalContainer, events);
const basketView = new BasketView(cloneTemplate(basketTemplate), events);
const orderForm = new OrderForm(cloneTemplate(orderFormTemplate), events);
const contactsForm = new ContactsForm(cloneTemplate(contactsFormTemplate), events);
const success = new Success(cloneTemplate(successTemplate), events);

api.getItems()
    .then(data => {
        catalogModel.setItems(data)
    })
    .catch(err => console.log(err))


events.on('catalog:changed', () => {
    const cardsHTMLArray = catalogModel.getItems().map(item => new Card(cloneTemplate(cardCatalogTemplate), events).render(item));
    catalogView.render({cardsList: cardsHTMLArray})
})

events.on('basket:changed', () => {
    header.render({counter: basketModel.getCount()});
})

events.on('card:selected', ({id}: {id: string}) => {
    catalogModel.setPreview(id)
})

events.on('preview:changed', () => {
    const previewItem = catalogModel.getPreview();

    let buyButtonObj: IBuyButton;
    if (previewItem.price) {
        if (basketModel.contains(previewItem.id)) {
            buyButtonObj = buyButtonSettings.remove;
        } else buyButtonObj = buyButtonSettings.buy;
    } else buyButtonObj = buyButtonSettings.disabled;

    const previewCard = new Card(
        cloneTemplate(cardPreviewTemplate), events
    ).render({...previewItem, buyButton: buyButtonObj});
    modal.render({content: previewCard})
})

events.on('modal:close', () => {
    modal.close();
    userModel.clearUserInfo();
    orderForm.clearForm();
    contactsForm.clearForm();
})

events.on('item:buy', ({id}: {id: string}) => {
    basketModel.addItem(catalogModel.getItem(id));
    modal.close();
})

events.on('item:remove', ({id}: {id: string}) => {
    basketModel.removeItem(id);
})

events.on('basket:open', () => {
    const basketItems = basketModel.getItems();
    const basketTotalValue = basketModel.getTotal();

    const basketCardsList = basketItems.map(
        (item, indexVal) => new Card(
            cloneTemplate(cardBasketTemplate), events
        ).render({...item, index: indexVal + 1}));

    let basketObj: IBasketView = {
        basketList: basketCardsList,
        basketTotal: basketTotalValue,
        basketButtonState: !(basketTotalValue === 0),
        basketEmpty: basketItems.length === 0
    }

    modal.render({content: basketView.render(basketObj)});
})


events.on('order:start', () => {
    modal.render({content: orderForm.render({
        altButton: null,
        submitState: false,
        error: ''
    })});
});

events.on('payment:input', (data: Partial<IUserInfo>) => {
    userModel.setUserInfo(data);
    orderForm.render({altButton: data.payment});
});

events.on('address:input', (data: Partial<IUserInfo>) => {
    userModel.setUserInfo(data);
});

events.on('contacts:input', (data: Partial<IUserInfo>) => {
    userModel.setUserInfo(data);
    console.log(userModel);
})

events.on('error:changed', (data: IOrderForm) => {
    orderForm.render(data);
})

events.on('errorContacts:changed', (data: IContactsForm) => {
    contactsForm.render(data);
    console.log('errorContacts:changed EVENT');
    console.log(data);
})

events.on('order:ready', (data: IUserInfo) => {
    orderForm.render({
        altButton: data.payment,
        submitState: true,
        error: ''
    })
})

events.on('order:submit', () => {
    modal.render({content: contactsForm.render({
        submitState: false,
        error: ''
    })})
})

events.on('contacts:change', (data: Partial<IUserInfo>) => {
    userModel.setUserInfo(data);
})

events.on('contacts:ready', (data: IUserInfo) => {
    contactsForm.render({submitState: true, error: ''});
})

events.on('contacts:submit', () => {
    const finalOrder = Object.assign(userModel.getUserInfo(), basketModel.getOrderInfo());
    console.log(finalOrder);
    modal.render({content: success.render({
        total: finalOrder.total
    })})
    basketModel.clearBasket();
})

events.on('success:close', () => {
    modal.close();
    basketModel.clearBasket();
    userModel.clearUserInfo();
    orderForm.clearForm();
    contactsForm.clearForm();
})
