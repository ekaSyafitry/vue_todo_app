import modal from '../components/modal.vue'
import modalConfirm from '../components/modalConfirm.vue'
export default {
    name: 'Home',
    components: {
        vuejsDatepicker,
        modal,
        modalConfirm
    },
    data: () => ({
        addActive: false,
        database: firebase.database(),
        dateTodo: '',
        getDate: new Date(),
        day: '',
        sel_date: '', 
        todolist: null,
        todolist_completed: [],
        todolist_incompleted: [],
        completeActive: false,
        id_todo: '',
        todos: [],
        hasLoad: false,
        editActive: false,
        dataModal: [],
        trashActive: false,
        incompleteActive: false,
        complete: false,
        isLoad: false,
        current : 'all',
        showMenu: false,
        totalComplete: 0,
        totalIncomplete: 0,
        percent: 0,
        sum: 0,
        installActive: false,
        deferredPrompt : null
    }),
    mounted() {
        this.isLoad =true
        this.formateDate()
        this.getData(this.getDate)
        // console.log(this.getDate)
        window.addEventListener('beforeinstallprompt', (e) => {
            this.showInstallPromt(e);
        });
          
        window.addEventListener('appinstalled', (evt) => {
            this.installActive = !this.installActive
            this.deferredPrompt = null;
        });
    },
    methods: {
        updateGetDate(val){
        this.getDate = val
        },
        installModal(){
            this.deferredPrompt.prompt();
            this.installActive = false
        },
        showInstallPromt(e){
            this.deferredPrompt = e;
            this.installActive = !this.installActive
            // console.log(this.installActive)
        },
        countProgress(){
            // console.log(this.current)
            if (this.current === 'all'){
                // console.log('sini')
                this.totalComplete = this.todolist_completed.length
                this.totalIncomplete = this.todolist_incompleted.length
                this.sum = this.todos.length
                let num = this.totalComplete / this.sum * 100
                this.percent = num.toFixed(1);
                var elem = document.getElementById("myBar");
                if(this.todos.length == 0){
                  elem.style.width = "0%";  
                }
                else{
                  elem.style.width = this.percent + "%";  
                }
            }
        },
        realtimedata(data) {
            let reads = []
            data.forEach(function (val) {
                reads.push({...val.val(), id: val.key})
            })

            this.todolist = reads   
            this.todolist_completed = this.todolist.filter((todo)=> { return todo.complete  })
            this.todolist_incompleted = this.todolist.filter((todo)=> {return !todo.complete})
            this.isLoad = false
            this.hasLoad = true

            if (this.current == 'all'){
                this.todos = this.todolist
              }
            else if( this.current == 'com'){
            this.todos = this.todolist_completed
                }
            else{
            this.todos = this.todolist_incompleted
            }
            // console.log(this.todos)
            this.countProgress()
        },
        async getData(dt) {
            let g_date = dt.getFullYear() + "-" +  (dt.getMonth() + 1) + "-" + dt.getDate() 
            await this.database.ref('todolist').orderByChild('date').equalTo(g_date).on('value', (snapshot) => { this.realtimedata(snapshot) })     
        },
        formateDate() {
            let now = new Date()
            if (this.getDate.toDateString() !== now.toDateString()){
                var months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sept","Oct","Nov","Dec",];
                this.sel_date =  months[(this.getDate.getMonth())] + " " + (this.getDate.getDate()) + " " + this.getDate.getFullYear()
            }
            else{
                this.sel_date = "Today's tasks"
            }
        },
        editData(td) {
            this.editActive = true
            let tgl = new Date(td.date)
            td.date = tgl
            this.dataModal = td
        },
        completeData(td) {
            this.completeActive = true
            this.id_todo = td.id
            this.complete = td.complete
        },
        incompleteData(td) {
            this.incompleteActive = true
            this.id_todo = td.id
            this.complete = td.complete
        },
        confirmComplete() {
            // console.log(this.complete)
            if (this.complete) {
                this.database.ref('todolist/' + this.id_todo + '/complete').set(
                    false
                );
                this.incompleteActive = false
            } else {
                this.database.ref('todolist/' + this.id_todo + '/complete').set(
                    true
                );
                this.completeActive = false
            }
        },
        btnComplete(){
           this.current = 'com'
            // console.log(this.todolist)
            this.todos = this.todolist_completed
            this.showMenu = false
        },
        btnAll(){
            this.current = 'all'
            this.todos = this.todolist
            setTimeout(() => {
              this.countProgress()
            }, 500);
            this.showMenu = false
        },
        btnIncomplete(){
            this.current = 'incom'
            this.todos = this.todolist_incompleted
            this.showMenu = false
        },
        deleteData(id){
            this.id_todo = id
            this.trashActive = true
        },
        confirmDelete(){
            let userRef = this.database.ref('todolist/' + this.id_todo);
            userRef.remove()
            this.trashActive = false
        },
        toogleMenu(){
            this.showMenu = !this.showMenu;
        }
    },
    watch: {
        getDate: function (valNew, valOld) {
            this.getDate = valNew
            this.formateDate()
            this.getData(valNew)
            this.btnAll()

        }
    }

}