import React from 'react';
import * as SQLite from 'expo-sqlite';

const db=SQLite.openDatabase('gamelist.db');

//method returns a Promise - in the calling side .then(...).then(...)....catch(...) can be used
export const init=()=>{
    const promise=new Promise((resolve, reject)=>{
        db.transaction((tx)=>{
            //By default, primary key is auto_incremented - we do not add anything to that column
            //tx.executeSql('Drop table gamelist');
            tx.executeSql('create table if not exists gamelist(id integer not null primary key,gameid integer, name text not null, completed text not null);',
            //second parameters of execution:empty brackets - this parameter is not needed when creating table            
            [],
            //If the transaction succeeds, this is called
            ()=>{
                resolve();
            },
            //If the transaction fails, this is called
            (_,err)=>{
                reject(err);
            }
            );
        });
    });
    return promise;
};

export const deleteLocalData = () => {
    const promise=new Promise((resolve, reject)=>{
        db.transaction((tx)=>{
            tx.executeSql('DELETE FROM gamelist;',
            [],
            ()=>{
                resolve();
            },
            (_,err)=>{
                reject(err);
            }
            );
        });
    });
    return promise;
}

export const addGame=(name, gameid)=>{
    const promise=new Promise((resolve, reject)=>{
        db.transaction((tx)=>{
            let completedDefault = "no"
            //Here we use the Prepared statement, just putting placeholders to the values to be inserted
            tx.executeSql('insert into gamelist(gameid, name, completed) values(?,?,?);',
            //And the values come here
            [gameid, name, completedDefault],
            //If the transaction succeeds, this is called
            (_, result)=>{
                resolve(result);
            },
            //If the transaction fails, this is called
            (_,err)=>{
                reject(err);
            }
            );
        });
    });
    return promise;
};

export const deleteGame=(id)=>{
    const promise=new Promise((resolve, reject)=>{
        db.transaction((tx)=>{
            tx.executeSql('delete from gamelist where id=?',
            [id],
            (_,result)=>{
                resolve(result);
            },
            (_,err)=>{
                reject(err);
            });
        });
    });
    return promise;
}

export const setGameAsCompleted=(id, completed)=>{
    const promise=new Promise((resolve, reject)=>{
        db.transaction((tx)=>{
            let completedYes = '';
            if(completed == 'yes') {
                completedYes = 'no';
                console.log('Setting completed = no');
            }
            else {
                completedYes = 'yes';
                console.log("Setting completed = yes");
            }
            tx.executeSql('update gamelist set completed = ? where id=?',
            [completedYes ,id],
            (_,result)=>{
                resolve(result);
            },
            (_,err)=>{
                reject(err);
            });
        });
    });
    return promise;
}

export const fetchGameList=()=>{
    const promise=new Promise((resolve, reject)=>{
        db.transaction((tx)=>{
            //Here we select all from the table fish
            console.log("Execute sql")
            tx.executeSql('select * from gamelist;',
            [],
            (tx, result)=>{
                //console.log(result)
                resolve(result);
            },
            (tx,err)=>{
                reject(err);
            }
            );
        });
    });
    return promise;
};