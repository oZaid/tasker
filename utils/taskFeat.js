class TasksFeat {
    constructor (model, qeury){
        this.model = model;
        this.query = qeury;
    }
    
    filter (){
        // console.log(this.query);
        let queryString = JSON.stringify(this.query);
        queryString = JSON.parse(queryString)
        const exclude = ['limit', 'fields', 'sort'];
        exclude.forEach(q => delete queryString[q]);
        this.model = this.model.find(queryString).select('-__v');
        return this;
    }

    sort (){
        const sortBy = this.query.sort?.split(',').join(' ') || "-deadline" ;
        this.model = this.model.sort(sortBy);
        return this;
    }

    fields (){
        if (this.query.fields){
            const fields = this.query.fields?.split(',').join(' ') ;
            this.model = this.model.select(fields);
        }
        return this;
    }

    limitation (){
        const limit = +this.query.limit || 1000
        this.model = this.model.limit(limit);
        return this;
    }
}

module.exports = TasksFeat;