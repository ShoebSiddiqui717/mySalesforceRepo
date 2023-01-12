/**
 * @description       : 
 * @author            : ChangeMeIn@UserSettingsUnder.SFDoc
 * @group             : 
 * @last modified on  : 01-12-2023
 * @last modified by  : ChangeMeIn@UserSettingsUnder.SFDoc
**/
public with sharing class AccountClass {
    public static void Method(list<account> aList) 
    {
        set<id> accIds = new set<id>();
        map<id,account> accMap = new Map<id,account> ();
        for(Account aa : aList){
            accIds.add(aa.id);
            accMap.put(aa.id,aa);
        }

        list<contact> conList = [select id,phone,AccountId from contact where AccountId in : accIds];

        for(Contact cc : conList){
            cc.Phone = accMap.get(cc.AccountId).Phone;
        }

        update conlist;

    }
}
