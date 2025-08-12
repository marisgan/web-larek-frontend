import { IItem } from "../../types";
import { IEvents } from "../base/events";
import { IBasketModel } from "./BasketModel";

const errorMessages = {
    payment: 'Выберите способ оплаты',
    address: 'Необходимо указать адрес',
    email: 'Необходимо указать email',
    phone: 'Необходимо указать номер телефона'
}

export type TPaymentMethod = 'cash' | 'online';

export interface IUserInfo {
    payment: string;
    address: string;
    email: string;
    phone: string;
}

export class UserModel {
    protected userInfo: IUserInfo = {
        payment: '',
        address: '',
        email: '',
        phone: ''
    };

    constructor(protected events: IEvents) {
    }

    getUserInfo(): IUserInfo {
        return this.userInfo;
    }

    setUserInfo(data: Partial<IUserInfo>): void {
        Object.assign(this.userInfo, data);

        if (this.userInfo.payment && this.userInfo.address && this.userInfo.email && this.userInfo.phone) {
            this.events.emit('contacts:ready', this.userInfo);
            return
        }
        if (!this.userInfo.payment && this.userInfo.address && !this.userInfo.email && !this.userInfo.phone) {
            this.events.emit('error:changed', {error: errorMessages.payment, submitState: false});
            return
        }
        if (this.userInfo.payment && !this.userInfo.address && !this.userInfo.email && !this.userInfo.phone) {
            this.events.emit('error:changed', {error: errorMessages.address, submitState: false});
            return
        }
        if (this.userInfo.payment && this.userInfo.address && !this.userInfo.email && !this.userInfo.phone) {
            this.events.emit('order:ready', this.userInfo)
            return
        }

        if (!this.userInfo.email && this.userInfo.phone && this.userInfo.payment && this.userInfo.address) {
            this.events.emit('errorContacts:changed', {error: errorMessages.email, submitState: false});
            console.log('error - no email')
            return
        }
        if (this.userInfo.email && !this.userInfo.phone && this.userInfo.payment && this.userInfo.address) {
            this.events.emit('errorContacts:changed', {error: errorMessages.phone, submitState: false});
            console.log('error - no phone')
            return;
        }

    }

    clearUserInfo() {
        Object.assign(this.userInfo, {payment: '', address: '', email: '', phone: ''});
    }
}
