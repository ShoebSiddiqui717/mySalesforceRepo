import { LightningElement, wire , api } from 'lwc';
import { getRecord, getFieldValue } from 'lightning/uiRecordApi';
import NAME_FIELD from '@salesforce/schema/Account.Name';
import OWNER_NAME_FIELD from '@salesforce/schema/Account.Owner.Name';
import PHONE_FIELD from '@salesforce/schema/Account.Phone';
import INDUSTRY_FIELD from '@salesforce/schema/Account.Industry';
import Billing_Street from '@salesforce/schema/Account.BillingStreet';
import Billing_City from '@salesforce/schema/Account.BillingCity';
import Billing_Country from '@salesforce/schema/Account.BillingCountry';
import Billing_PostalCode from '@salesforce/schema/Account.BillingPostalCode';
import Billing_State from '@salesforce/schema/Account.BillingState';
import RECORDTYPE_FIELD from '@salesforce/schema/Account.RecordType.Name';

export default class DemoMailAddress extends LightningElement {
    @api recordId;
    
    @wire(getRecord, { recordId: '$recordId', fields: [NAME_FIELD, INDUSTRY_FIELD], optionalFields: [PHONE_FIELD, OWNER_NAME_FIELD,Billing_Country,Billing_Street,Billing_City,Billing_PostalCode,Billing_State,RECORDTYPE_FIELD] })
    account;


     get name() {
        console.log('Name'+getFieldValue(this.account.data, NAME_FIELD));
        return getFieldValue(this.account.data, NAME_FIELD);
    }

    get phone() {
        return getFieldValue(this.account.data, PHONE_FIELD);
    }

    get industry(){
        return getFieldValue(this.account.data, INDUSTRY_FIELD);
    }
    
    get owner() {
        return getFieldValue(this.account.data, OWNER_NAME_FIELD);
        
    }

    get country() {
        console.log('Country'+getFieldValue(this.account.data, Billing_Country));
        return getFieldValue(this.account.data, Billing_Country);
        
    }

    get City() {
        console.log('Country'+getFieldValue(this.account.data, Billing_City));
        return getFieldValue(this.account.data, Billing_City);
        
    }

    get street() {
        console.log('Country'+getFieldValue(this.account.data, Billing_Street));
        return getFieldValue(this.account.data, Billing_Street);
        
    }

    get state() {
        return getFieldValue(this.account.data, Billing_State);
        
    }

    get PostalCode() {
        return getFieldValue(this.account.data, Billing_PostalCode);
        
    }
    get FormattedAddress() {
        let street = getFieldValue(this.account.data, Billing_Street);
        let city = getFieldValue(this.account.data, Billing_City);
        let state = getFieldValue(this.account.data, Billing_State);
        let postalCode = getFieldValue(this.account.data, Billing_PostalCode);
        let country = getFieldValue(this.account.data, Billing_Country);
        let address = street + '\n' + city + ', ' + state + ' ' + postalCode + '\n' + country;;
        
        return address;
        }

        get FormattedAddress2() {
            let str = getFieldValue(this.account.data, Billing_Street) ? getFieldValue(this.account.data, Billing_Street) : '';
            str += getFieldValue(this.account.data, Billing_City) ? ', ' + getFieldValue(this.account.data, Billing_City) : '';
            str += getFieldValue(this.account.data, Billing_State) ? ', ' + getFieldValue(this.account.data, Billing_State) : '';
            str += getFieldValue(this.account.data, Billing_PostalCode) ? ' ' + getFieldValue(this.account.data, Billing_PostalCode) : '';
            str += getFieldValue(this.account.data, Billing_Country) ? ', ' + getFieldValue(this.account.data, Billing_Country) : '';
            return str;
            }

            get FormattedAddress3() {
                let str = getFieldValue(this.account.data, Billing_Street) ? getFieldValue(this.account.data, Billing_Street)+'\n' : '';
                str += getFieldValue(this.account.data, Billing_City) ? getFieldValue(this.account.data, Billing_City)+', ' : '';
                str += getFieldValue(this.account.data, Billing_State) ? getFieldValue(this.account.data, Billing_State)+', ' : '';
                str += getFieldValue(this.account.data, Billing_PostalCode) ? getFieldValue(this.account.data, Billing_PostalCode)+'\n' : '';
                str += getFieldValue(this.account.data, Billing_Country) ? getFieldValue(this.account.data, Billing_Country) : '';
                return str;
                }

                get FormattedAddress4() {
                    let street = getFieldValue(this.account.data, Billing_Street),
                    city = getFieldValue(this.account.data, Billing_City),
                    state = getFieldValue(this.account.data, Billing_State),
                    postalCode = getFieldValue(this.account.data, Billing_PostalCode),
                    country = getFieldValue(this.account.data, Billing_Country);
                    return street + '\n' + city + ', ' + state + ' ' + postalCode + '\n' + country;
                }  


    get RECORDTYPE_FIELD(){
        return getFieldValue(this.account.data, RECORDTYPE_FIELD);
    }
                    
    

    

}