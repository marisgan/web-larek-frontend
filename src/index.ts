import { API_URL, CDN_URL } from './utils/constants'
import './scss/styles.scss';
import { WebLarekApi } from './components/WebLarekApi';
import { EventEmitter } from './components/base/events';
import { CatalogModel } from './components/models/CatalogModel';
import { BasketModel } from './components/models/BasketModel';
import { Card } from './components/views/Card';
import { IBuyButton, IBasketView, IUserInfo, IForm } from './types';
import { cloneTemplate } from './utils/utils';
import { CatalogView} from './components/views/CatalogView';
import { Header } from './components/views/Header';
import { Modal } from './components/views/Modal';
import { BasketView } from './components/views/BasketView';
import { buyButtonSettings } from './utils/constants';
import { UserModel } from './components/models/UserModel';
import { Form } from './components/views/Form';
import { Success } from './components/views/Success';


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
const orderForm = new Form(cloneTemplate(orderFormTemplate), events);
const contactsForm = new Form(cloneTemplate(contactsFormTemplate), events);
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
    basketModel.addItem(id);
    modal.close();
})

events.on('item:remove', ({id}: {id: string}) => {
    basketModel.removeItem(id);
})

events.on('basket:open', () => {
    const basketItemsIds = basketModel.getItems();
    const basketTotalValue = catalogModel.getTotal(basketItemsIds);

    const basketCardsList = basketItemsIds.map(
        (id, indexVal) => new Card(
            cloneTemplate(cardBasketTemplate), events
        ).render({...catalogModel.getItem(id), index: indexVal + 1}));

    let basketObj: IBasketView = {
        basketList: basketCardsList,
        basketTotal: basketTotalValue,
        basketButtonState: !(basketTotalValue === 0),
        basketEmpty: basketModel.getCount() === 0
    }

    modal.render({content: basketView.render(basketObj)});
})


events.on('order:start', () => {
    modal.render({content: orderForm.render({
        payment: null,
        submitState: false,
        error: ''
    })});
});

events.on('payment:input', (data: Partial<IUserInfo>) => {
    userModel.setUserInfo(data);
    orderForm.render({payment: data.payment});
});

events.on('order:input', (data: Partial<IUserInfo>) => {
    userModel.setUserInfo(data);
});

events.on('contacts:input', (data: Partial<IUserInfo>) => {
    userModel.setUserInfo(data);
})

events.on('order:error', (data: Partial<IForm>) => {
    orderForm.render(data);
})

events.on('contacts:error', (data: Partial<IForm>) => {
    contactsForm.render(data);
})


events.on('order:ready', (data: IUserInfo) => {
    orderForm.render({
        ...data,
        submitState: true,
        error: ''
    })
    contactsForm.render({error: ''})
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
    contactsForm.render({...data, submitState: true, error: ''});
})

events.on('contacts:submit', () => {
    const basketItemsIds = basketModel.getItems();
    const orderInfo = {items: basketItemsIds, total: catalogModel.getTotal(basketItemsIds)};
    const finalOrder = Object.assign(orderInfo, userModel.getUserInfo());

    api.postOrder(finalOrder)
        .then(res => {
            modal.render({content: success.render({total: res.total})});
            basketModel.clearBasket();
            userModel.clearUserInfo();
            orderForm.clearForm();
            contactsForm.clearForm();
        })
        .catch(err => console.log(err))
})

events.on('success:close', () => {
    modal.close();
})
