/**
 * @description       : Whenever account's Phone Field is Update then all related contact's phone field should also get updated with Parent account's Phone.
 * @author            : Shoeb
 * @group             : Individual
 * @last modified on  : 01-12-2023
 * @last modified by  : ChangeMeIn@UserSettingsUnder.SFDoc
**/
trigger Acc_phoneConPhoneUpdate on Account (after update) 
{
    AccountClass.Method(Trigger.new);
}