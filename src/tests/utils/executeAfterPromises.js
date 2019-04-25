export default function executeAfterPromises(fn){
    return new Promise(function(resolve){
        setTimeout(function(){
            resolve();
        }, 1);
    }).then(fn).catch(function(err){
        console.log(err)
    });
};
