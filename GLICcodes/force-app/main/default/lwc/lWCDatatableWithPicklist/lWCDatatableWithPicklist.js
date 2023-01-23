import { LightningElement, track, wire,api } from 'lwc';
import fetchAccounts from '@salesforce/apex/AccountDataController.fetchAccounts';
import ACCOUNT_OBJECT from '@salesforce/schema/Analytic__c';
import INFORCE_CAR from '@salesforce/schema/Analytic__c.Id';
import PROD_GROUP from '@salesforce/schema/Analytic__c.Product_Group__c';
import NO_QUOTE_RES from '@salesforce/schema/Analytic__c.No_Quote_Reason__c';
import LOST_RES from '@salesforce/schema/Analytic__c.Lost_Reason__c';
import CURR_STATUS from '@salesforce/schema/Analytic__c.Current_Status__c';
import { updateRecord } from 'lightning/uiRecordApi';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { refreshApex } from '@salesforce/apex';
import { getPicklistValues,getPicklistValuesByRecordType, getObjectInfo } from 'lightning/uiObjectInfoApi';

import { NavigationMixin } from 'lightning/navigation';
import { encodeDefaultFieldValues } from 'lightning/pageReferenceUtils';
import getFieldPickList from '@salesforce/apex/MassUpdateLWCController.getFieldTypeOptions';
import fieldApiName from '@salesforce/apex/MassUpdateLWCController.getFieldApiName';
import updateMass from '@salesforce/apex/MassUpdateLWCController.massUpdateAnalyticalRecord';
import insertAnalyticRecord from '@salesforce/apex/MassUpdateLWCController.insertAnalytical';
import deleteAnlaytical from '@salesforce/apex/MassUpdateLWCController.deleteAnalyticalRecord';
import SystemModstamp from '@salesforce/schema/Account.SystemModstamp';

const columns = [
    { label: 'Analytic Name', fieldName: 'AnalyticNAme', type: 'url',
    typeAttributes: { label: { fieldName: 'Name' }, target: '_blank'} },
    {
        label: 'Product Group', fieldName: 'Product_Group__c', type: 'picklistColumn', editable: false , typeAttributes: {
            placeholder: 'Product Group', options: { fieldName: 'pickListOptions1' }, 
            value: { fieldName: 'Product_Group__c' }, // default value for picklist,
            context: { fieldName: 'Id' } // binding account Id with context variable to be returned back
        }
    },
    
    { label: 'Voluntary', fieldName: 'Voluntary__c', editable: true ,type:'boolean'},
    {
        label: 'Inforce Carrier', fieldName: 'Inforce_Carrier__c',type: 'picklistColumn', editable: false, typeAttributes: {
            placeholder: 'Choose Inforce Carrier', options: { fieldName: 'pickListOptions' }, 
            value: { fieldName: 'Inforce_Carrier__c' }, // default value for picklist,
            context: { fieldName: 'Id' } // binding account Id with context variable to be returned back
        }
    },
    {
        label: 'Current Status', fieldName: 'Current_Status__c', editable: false
        
        //  typeAttributes: {
        //      placeholder: 'Choose Current Status', options: { fieldName: 'pickListOptions4' }, 
        //      value: { fieldName: 'Current_Status__c' }, // default value for picklist,
        //      context: { fieldName: 'Id' } // binding account Id with context variable to be returned back
        //  }
    },
    { label: 'Quoted Annual PX', fieldName: 'Quoted_Annual_PX__c', editable: true ,type:'Currency'},
    { label: 'No Quote', fieldName: 'No_Quote__c', editable: true,type:'boolean' },
    {
        label: 'No Quote Reason', fieldName: 'No_Quote_Reason__c', type: 'picklistColumn', editable: false, typeAttributes: {
            placeholder: 'No Quote Reason', options: { fieldName: 'pickListOptions2' }, 
            value: { fieldName: 'No_Quote_Reason__c' }, // default value for picklist,
            context: { fieldName: 'Id' } // binding account Id with context variable to be returned back
        }
    },
    { label: 'Lost', fieldName: 'Lost__c', editable: true ,type:'boolean'},
    {
        label: 'Lost Reason', fieldName: 'Lost_Reason__c', type: 'picklistColumn', editable: false, typeAttributes: {
            placeholder: 'Lost Reason', options: { fieldName: 'pickListOptions3' }, 
            value: { fieldName: 'Lost_Reason__c' }, // default value for picklist,
            context: { fieldName: 'Id' } // binding account Id with context variable to be returned back
        }
    } ,

    
    { label: 'Quoted', fieldName: 'Quoted__c', editable: true,type:'boolean' },
   
    { label: 'Sold', fieldName: 'Sold__c', editable: true ,type:'boolean'},
    
    { label: 'Open Enrollment Approved', fieldName: 'Open_Enrollment_Approved__c', editable: true ,type:'boolean' },

    
    
]

export default class LWCDatatableWithPicklist extends NavigationMixin(LightningElement) {
    @api recordId;
    columns = columns;
    showSpinner = false;
    @track data = [];
    @track accountData;
    @track draftValues = [];
    lastSavedData = [];
    @track pickListOptions;
    INFORCE_CAR=[];
    PROD_GROUP=[];
    noquoteres=[];
    nolost=[];
    currstatus=[];

fileLabel;
options;
isShowModal = false;
selectedRecordIdList=[];
fieldApiNameToShow;
value = 'none';
recodIdSet
msg ;


    
 
    @wire(getObjectInfo, { objectApiName: ACCOUNT_OBJECT })
    objectInfo;

    @wire(getPicklistValuesByRecordType, {
        recordTypeId: "$objectInfo.data.defaultRecordTypeId",
        objectApiName: ACCOUNT_OBJECT
    })
    wirePickList({ error, data }) {
        if (data) {
            
            //this.pickListOptions = data.values;
            this.INFORCE_CAR = data.picklistFieldValues.Inforce_Carrier__c.values;
            this.PROD_GROUP = data.picklistFieldValues.Product_Group__c.values;
            this.noquoteres = data.picklistFieldValues.No_Quote_Reason__c.values;
            this.nolost = data.picklistFieldValues.Lost_Reason__c.values;
           // this.currstatus = data.picklistFieldValues.Current_Status__c.values;
            console.log('VAlue555 = ', data.picklistFieldValues.Inforce_Carrier__c.values);
            console.log('VAlue234 = ', this.PROD_GROUP);
        } else if (error) {
            console.log(error);
        }
    }
   
 
    //here I pass picklist option so that this wire method call after above method
    @wire(fetchAccounts, {picklist:'$currstatus', recordId:'$recordId'})
    accountData(result) {
        this.accountData = result;
        console.log(JSON.stringify('result value '+this.accountData)); 
        if (result.data) {
            let tempRecs = [];

            
            this.data = JSON.parse(JSON.stringify(result.data));
 
            this.data.forEach(ele => {
                ele.pickListOptions = this.INFORCE_CAR;
                ele.pickListOptions1 = this.PROD_GROUP;
                ele.pickListOptions2=  this.noquoteres;
                ele.pickListOptions3= this.nolost;
               // ele.pickListOptions4= this.currstatus;

               let tempRec = Object.assign( {}, ele );  
               console.log(tempRec.id);
                tempRec.AnalyticNAme = '/' + tempRec.Id;
                tempRecs.push( tempRec );
            })
            this.data=tempRecs;
            this.lastSavedData = JSON.parse(JSON.stringify(this.data));
 
        } else if (result.error) {
            this.data = undefined;
        }
    };
 
    updateDataValues(updateItem) {
        let copyData = JSON.parse(JSON.stringify(this.data));
 
        copyData.forEach(item => {
            if (item.Id === updateItem.Id) {
                for (let field in updateItem) {
                    item[field] = updateItem[field];
                }
            }
        });
 
        //write changes back to original data
        this.data = [...copyData];
    }
 
    updateDraftValues(updateItem) {
        let draftValueChanged = false;
        let copyDraftValues = [...this.draftValues];
        //store changed value to do operations
        //on save. This will enable inline editing &
        //show standard cancel & save button
        copyDraftValues.forEach(item => {
            if (item.Id === updateItem.Id) {
                for (let field in updateItem) {
                    item[field] = updateItem[field];
                }
                draftValueChanged = true;
            }
        });
 
        if (draftValueChanged) {
            this.draftValues = [...copyDraftValues];
        } else {
            this.draftValues = [...copyDraftValues, updateItem];
        }
    }
 
    //listener handler to get the context and data
    //updates datatable
    picklistChanged(event) {
        event.stopPropagation();
        let dataRecieved = event.detail.data;
        console.log('data re',JSON.stringify(dataRecieved));
      
       if(dataRecieved.placeholder=='Choose Inforce Carrier')
       {
        let updatedItem = { Id: dataRecieved.context, Inforce_Carrier__c: dataRecieved.value  };
        this.updateDraftValues(updatedItem);
        this.updateDataValues(updatedItem);
       }
       else if(dataRecieved.placeholder=='Product Group')
       {
        let updatedItem = { Id: dataRecieved.context, Product_Group__c: dataRecieved.value  };
        this.updateDraftValues(updatedItem);
        this.updateDataValues(updatedItem);
       }
       else if(dataRecieved.placeholder=='No Quote Reason')
       {
        let updatedItem = { Id: dataRecieved.context, No_Quote_Reason__c: dataRecieved.value  };
        this.updateDraftValues(updatedItem);
        this.updateDataValues(updatedItem);
       }
       else if(dataRecieved.placeholder=='Lost Reason')
       {
        let updatedItem = { Id: dataRecieved.context, Lost_Reason__c: dataRecieved.value  };
        this.updateDraftValues(updatedItem);
        this.updateDataValues(updatedItem);
       }
    //     else if(dataRecieved.placeholder=='Choose Current Status')
    //    {
    //     let updatedItem = { Id: dataRecieved.context, Current_Status__c: dataRecieved.value  };
    //     this.updateDraftValues(updatedItem);
    //     this.updateDataValues(updatedItem);
    //    }
        // console.log(updatedItem);
        // this.updateDraftValues(updatedItem);
        // this.updateDataValues(updatedItem);
    }
 
    //handler to handle cell changes & update values in draft values
    handleCellChange(event) {
        this.updateDraftValues(event.detail.draftValues[0]);
    }
 
    handleSave(event) {
        this.showSpinner = true;
        this.saveDraftValues = this.draftValues;
        console.log('save value',this.saveDraftValues);
 
        const recordInputs = this.saveDraftValues.slice().map(draft => {
            const fields = Object.assign({}, draft);
            console.log('fields',fields);
            return { fields };
        });
 
        // Updateing the records using the UiRecordAPi
        const promises = recordInputs.map(recordInput => updateRecord(recordInput));
        Promise.all(promises).then(res => {
            console.log('REsult Save',res);
            this.showToast('Success', 'Records Updated Successfully!', 'success', 'dismissable');
            this.draftValues = [];
            return this.refresh();
        }).catch(error => {
            console.log(error);
            this.showToast('Error', 'An Error Occured!!', 'error', 'dismissable');
        }).finally(() => {
            this.draftValues = [];
            this.showSpinner = false;
        });
    }
 
    handleCancel(event) {
        //remove draftValues & revert data changes
        this.data = JSON.parse(JSON.stringify(this.lastSavedData));
        this.draftValues = [];
       this.refresh();
    }
 
    showToast(title, message, variant, mode) {
        const evt = new ShowToastEvent({
            title: title,
            message: message,
            variant: variant,
            mode: mode
        });
        this.dispatchEvent(evt);
    }
 
    // This function is used to refresh the table once data updated
    async refresh() {
        await refreshApex(this.accountData);
    }
 handleNewAnalytic() {

        const defaultValues = encodeDefaultFieldValues({
            Opportunity__c: this.recordId
           
        });
        this[NavigationMixin.Navigate]({
            type: 'standard__objectPage',
            attributes: {
                objectApiName: 'Analytic__c',
                actionName: 'new'
            },
            state: {
                defaultFieldValues: defaultValues
            }
        });
    }
 showModalBox() {  
        console.log('test');
         var selectedRecords =  this.template.querySelector("c-l-w-c-custom-datatable-type").getSelectedRows();
         this.selectedAnalytical =selectedRecords;
        
        if(selectedRecords.length > 0){
        this.insertRecord();  
        this.msg =  'Number of records selected for update: '+selectedRecords.length+'';
        console.log(this.msg);
        this.isShowModal = true;
        }
        else {
        
        const toastEvent = new ShowToastEvent({
                    title:'',
                    message: 'No record was selected. Please select records for mass update',
                    variant:'error'
                });
                this.dispatchEvent(toastEvent);
        
        
        
        
        
        }
        }

        hideModalBox() {  
            this.deleteRecord();
            this.isShowModal = false;
            }

            deleteRecord(){


                deleteAnlaytical({recId:this.analyticalId,oppId:this.recordId})
                .then(result =>{
                   this.value= 'none';
                   this.fieldApiNameToShow = '';
                   return this.refreshData ();
                   
                })
                .catch(error =>{
                console.log('error'+error);
                })      
                
                
                }

                insertRecord(){
                    insertAnalyticRecord({oppId:this.recordId})
                    .then(result =>{
                    console.log(result);
                    this.analyticalId = result;
                    })
                    .catch(error =>{
                    console.log('error'+error);
                    })   


            
}

@wire(getFieldPickList)
contacts({ error, data }) {

let options = [];
if(data){
data.forEach(res =>{

options.push({
label:res,
value :res,


});


});

}
this.options = options


this.error = error;
}

handleChange(event){

this.value = event.detail.value;
console.log( this.value);
fieldApiName({fieldLabelName: this.value}).then(result =>{
console.log('test'+result);
this.fieldApiNameToShow = result;
console.log(this.fieldApiNameToShow)

}).catch(error =>{

this.error =error;
})
}


handleSubmit(event){

event.preventDefault();
const fields = event.detail.fields;
console.log(JSON.stringify(fields));
updateMass({fieldtoUpdate:JSON.stringify(fields),objsToUpdate:this.selectedAnalytical})
.then(result =>{
    if(result == 'Updated Successfully') {
    this.showToast('Success', 'Records Updated Successfully!', 'success', 'dismissable');
    this.value= 'none';
    this.fieldApiNameToShow = '';
    this.refreshData ();
    return this.refresh();
    }
    else {
        this.showToast('Error',result , 'error', 'dismissable');
        this.value= 'none';
        this.fieldApiNameToShow = '';
        this.refreshData ();
        return this.refresh();

    }
    
})
.catch(error =>{
    console.log('error'+error);
})      


}

handleRowSelection(event){
    var selectedRows=event.detail.selectedRows;
    console.log('selectedRows');
    console.log(selectedRows);
}


async refreshData() {
    await refreshApex(this.contacts);
}
}