import { IEvents } from "../base/events";
import { RULES } from "../../utils/constants";
import { IUserInfo } from "../../types";


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
        this.validateAndEmit(this.userInfo);
    }

    private validateAndEmit(user: IUserInfo): void {
        for (const rule of RULES) {
            if (rule.when(user)) {
                rule.emit(this.events, user);
                return
            }
        }
    }

    clearUserInfo() {
        Object.assign(this.userInfo, {payment: '', address: '', email: '', phone: ''});
    }
}
