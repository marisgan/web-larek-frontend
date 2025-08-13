import { IEvents } from "../components/base/events";
import { IUserInfo } from "../types";

export const API_URL = `${process.env.API_ORIGIN}/api/weblarek`;
export const CDN_URL = `${process.env.API_ORIGIN}/content/weblarek`;


export const buyButtonSettings = {
    buy: {text: 'Купить', status: 'buy'},
    remove: {text: 'Удалить из корзины', status: 'remove'},
    disabled: {text: 'Недоступно', status: 'disabled'}
}

const errorMessages = {
    payment: 'Выберите способ оплаты',
    address: 'Необходимо указать адрес',
    email: 'Необходимо указать email',
    phone: 'Необходимо указать номер телефона'
}

type Rule = {
  when: (user: IUserInfo) => boolean;
  emit: (events: IEvents, user: IUserInfo) => void;
};

export const RULES: Rule[] = [
  {
    when: user => !!user.payment && !!user.address && !!user.email && !!user.phone,
    emit: (events, user) => events.emit('contacts:ready', user),
  },
  {
    when: user => !user.payment && !!user.address && !user.email && !user.phone,
    emit: (events) => events.emit('order:error', {
      error: errorMessages.payment, submitState: false}),
  },
  {
    when: user => !!user.payment && !user.address && !user.email && !user.phone,
    emit: (events) => events.emit('order:error', {
      error: errorMessages.address, submitState: false}),
  },
  {
    when: user => !!user.payment && !!user.address && !user.email && !user.phone,
    emit: (events, user) => events.emit('order:ready', user),
  },
  {
    when: user => !!user.payment && !!user.address && !user.email && !!user.phone,
    emit: (events) => events.emit('contacts:error', {
      error: errorMessages.email, submitState: false}),
  },
  {
    when: user => !!user.payment && !!user.address && !!user.email && !user.phone,
    emit: (events) => events.emit('contacts:error', {
      error: errorMessages.phone, submitState: false}),
  },
];