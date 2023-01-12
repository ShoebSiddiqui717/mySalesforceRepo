/**
 * @description       : 
 * @author            : ChangeMeIn@UserSettingsUnder.SFDoc
 * @group             : 
 * @last modified on  : 01-12-2023
 * @last modified by  : ChangeMeIn@UserSettingsUnder.SFDoc
**/
public with sharing class AccountClass {
    public static void Method(list<account> NewAccList,Map<id,account> oldAccMap) 
    {
        map<id,account> NewaccMap = new Map<id,account> ();
        for(Account aa : NewAccList){
            if(oldAccMap.get(aa.id).phone != aa.Phone){
                NewaccMap.put(aa.id,aa);
            }
            
        }

        list<contact> conList = [select id,phone,AccountId from contact where AccountId in : NewaccMap.keySet()];
        list<contact> conUpdate = new list<contact> ();
        
            for(Contact cc : conList){
                cc.Phone = NewaccMap.get(cc.AccountId).Phone;
                conUpdate.add(cc);
            }
        if(!conUpdate.isEmpty())
        {
            update conUpdate;
        }
        

        

    }
}
