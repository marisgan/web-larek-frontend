import { API_URL, CDN_URL } from './utils/constants'
import './scss/styles.scss';
import { WebLarekApi } from './components/WebLarekApi';
import { EventEmitter } from './components/base/events';
import { CatalogModel } from './components/models/CatalogModel';
import { BasketModel } from './components/models/BasketModel';
import { Card } from './components/views/Card';
import { cloneTemplate } from './utils/utils';
import { CatalogView} from './components/views/CatalogView';
import { Header } from './components/views/Header';
import { IItem } from './types';
import { Modal } from './components/views/Modal';
import { BasketView } from './components/views/BasketView';


const api = new WebLarekApi(API_URL, CDN_URL);
const events = new EventEmitter();

const catalogModel = new CatalogModel(events);
const basketModel = new BasketModel(events);

const cardCatalogTemplate = document.querySelector('#card-catalog') as HTMLTemplateElement;
const cardPreviewTemplate = document.querySelector('#card-preview') as HTMLTemplateElement;
const cardBasketTemplate = document.querySelector('#card-basket') as HTMLTemplateElement;
const basketTemplate = document.querySelector('#basket') as HTMLTemplateElement;
const headerContainer = document.querySelector('.header') as HTMLElement;
const catalogContainer = document.querySelector('.gallery') as HTMLElement;
const modalContainer = document.querySelector('.modal') as HTMLElement;

const catalogView = new CatalogView(catalogContainer, events);
const header = new Header(headerContainer, events);
const modal = new Modal(modalContainer, events);
const basketView = new BasketView(cloneTemplate(basketTemplate), events);


api.getItems()
    .then(data => {
        catalogModel.setItems(data)
        console.log(catalogModel)
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
    catalogModel.setItemPreview(id)
})
events.on('preview:changed', ({previewItem}: {previewItem: IItem}) => {
    const previewCard = new Card(cloneTemplate(cardPreviewTemplate), events).render(previewItem)
    modal.render({content: previewCard})
})

events.on('modal:close', () => {
    modal.close();
})

events.on('item:buy', ({id}: {id: string}) => {
    basketModel.addItem(catalogModel.getItem(id));
    modal.close();
})

events.on('item:remove', ({id}: {id: string}) => {
    basketModel.removeItem(id);
})

events.on('basket:open', () => {
    const basketCardsList = basketModel.getItems().map(item => new Card(cloneTemplate(cardBasketTemplate), events).render(item));
    const basketContent = basketView.render({basketList: basketCardsList, basketTotal: basketModel.getTotal()});
    modal.render({content: basketContent});
})
