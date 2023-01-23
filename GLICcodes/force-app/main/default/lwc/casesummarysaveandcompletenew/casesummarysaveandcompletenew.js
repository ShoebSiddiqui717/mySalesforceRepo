import { LightningElement,api,track } from 'lwc';
import updateOpportunity from '@salesforce/apex/saveandcompletecontroller.updateOpportunity';
import { getRecord, getRecordNotifyChange } from 'lightning/uiRecordApi';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import successmessage from '@salesforce/label/c.CS_success_message';

export default class Casesummarysaveandcompletenew extends LightningElement {
    @api recordId;
    @track message;
    
    label={successmessage};

    @api invoke(){
        this.updateOpportunity();
    }
    updateOpportunity(){
        console.log('recordId==='+this.recordId);
        updateOpportunity({casesummaryid:this.recordId})
        .then(result=>{
            this.message=result;
            this.error = undefined;
            console.log('this.message1==='+JSON.stringify(this.message));
            if(this.message==='success'){
                this.showToast('Success',this.label.successmessage,'success');
                getRecordNotifyChange([{recordId: this.recordId}]);
            }else{
                this.showToast('Error',this.message,'error');    
            }
            
        })
        .catch(error=>{
            this.message = error;
            this.error = undefined;
            console.log('this.message2==='+JSON.stringify(this.message));
            this.showToast('Error',this.message.body.message,'error');
        })
    }

    showToast(title,message,variant) {
        const event = new ShowToastEvent({
            title: title,
            message:message,
            variant: variant,
        });
        this.dispatchEvent(event);
    }
}