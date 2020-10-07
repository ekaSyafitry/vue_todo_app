<template>
 <div>
   
      <div class="container home">
        <div class="calender-box">

          <div class="header">
            <h1>To-do</h1>
            <div class="box-date">
              <div class="cal">
                <vuejs-datepicker v-model="getDate" :calendar-button="true" calendar-button-icon="far fa-calendar-alt"
                wrapper-class="date-cal" input-class="input-date"></vuejs-datepicker>
              </div>
            </div>
          </div>

        </div>

        <div class="card">
          <!-- {{todos}} -->
          <div class="wrapTitle">
            <div class="wrapDay">
              <h2  v-if="current === 'all'">{{sel_date}}</h2>
              <h2  v-if="current === 'com'">Complete tasks</h2>
              <h2 v-if="current === 'incom'">Incomplete tasks</h2>
              <div class="btnFilter" @click="toogleMenu"><i class="fas fa-filter"></i></div>
              <div :class="[showMenu ? 'circle show' : 'circle']">
                <div id="all" @click="btnAll" :class="[current === 'all'? 'active' : '']">All</div>
                <div id="complete" @click="btnComplete" :class="[current === 'com'? 'active' : '']">Complete</div>
                <div id="incomplete" @click="btnIncomplete" :class="[current === 'incom'? 'active' : '']">Incomplete
                </div>
              </div>
            </div>
            <div v-if="current === 'all'">
              <div class="unfinished">{{totalIncomplete}} unfinished tasks from total {{sum}} </div>
              <div class="meter">
                <div id="myBar"></div>
              </div>
            </div>
             <div style="color: #60563d;" v-if="current === 'com'">{{totalComplete}} tasks </div>
            <div style="color: #60563d;" v-if="current === 'incom'">{{totalIncomplete}} tasks </div>
          </div>

          <div class="card-box">
            <div class="wrapLoad" v-if="isLoad">
             <div class="lds-roller"><div></div><div></div><div></div><div></div></div>
            </div>
           <div v-if="hasLoad">
            <div style="padding-top: 25px;" v-if="todos.length == 0">
              <img src="../assets/undraw_empty_xct9.svg" alt="" width="100%">
              <div class="empty">No plan yet..</div>
            </div>
            <ul v-else style="list-style-type: none;">
              <li class="card-list" v-for="(todo,i) in todos" :key="i">
                <div class="btn-check">
                  <i class="fas fa-check-circle" v-if="todo.complete" @click="incompleteData(todo)"></i>
                  <i class="far fa-circle" v-else @click="completeData(todo)"></i>
               </div>
               <div  style="width: 73%; margin-right: 8px;">
                <div :class="[todo.complete == true ? 'title cross' : 'title']">{{todo.name}}</div>
                <div :class="[todo.complete == true ? 'card-desc cross' : 'card-desc']" v-if="todo.notes != ''">{{todo.notes}} </div>
               </div>
                <div class="btn-group">
                  <div @click="editData(todo)"><i class="far fa-edit"></i></div>
                  <div @click="deleteData(todo.id)"><i class="far fa-trash-alt"></i></div>
                </div>
              </li>
            </ul>
            <div class="btn-float">
              <button @click="addActive = true"><i class="fas fa-plus"></i></button>
            </div>
          </div>
          </div>
        </div>
        <modal :modalActive="editActive" @updateModal="editActive = false" :dataModal="dataModal" type="edit" />
        <modal :modalActive="addActive" type="add" @updateModal="addActive = false" />
        <modalConfirm type="complete" :completeActive="completeActive" @yesBtn="confirmComplete()"
          @updateM="completeActive = false" />
        <modalConfirm type="incomplete" :completeActive="incompleteActive" @yesBtn="confirmComplete()"
          @updateM="incompleteActive = false" />
        <modalConfirm type="trash" :completeActive="trashActive" @yesBtn="confirmDelete()"
          @updateM="trashActive = false" />
        <modalConfirm type="install" :completeActive="installActive" @yesBtn="installModal()" @updateM="installActive=false"/>
      </div>
      </div>
</template>

<style lang="scss">
  .container {
    max-width: 500px;
    height: 100vh;
    overflow: hidden;
    margin: 0 auto;
    background: #fff;
    display: grid;
    grid-template-rows: 13% 87%;
    background: linear-gradient(71deg, rgba(250, 94, 111, 1) 30%, rgba(251, 149, 97, 1) 70%);
  }

  .calender-box {
    background: linear-gradient(71deg, rgba(250, 94, 111, 1) 30%, rgba(251, 149, 97, 1) 70%);
    display: grid;

    h1 {
      color: #fff;
      align-self: center;
    }

    .box-date {
      align-self: flex-end;
      color: white;

      .cal {
        align-self: end;
        text-align: end;

        .date-cal {
          text-align: right !important;

          i {
            font-size: 25px;
          }

          .input-date {
            display: none;
          }

          .vdp-datepicker__calendar {
            padding-bottom: 10px;
            top: 37px;
            right: 0;
            color: #6D4C41;
            max-width: 250px;

            .cell {
              font-size: 12px;
              height: 22px !important;
              line-height: 22px !important;
            }

            .cell.selected {
              background: #EF5350 !important;
              color: #fff;
            }
          }
        }
      }
    }

    .header{
      margin:20px 25px;
      align-self: center;
      display: flex;
      justify-content: space-between;
    }

  }

  .card {
    background-color: #fff;
    border-radius: 50px 0 0 0;
    .wrapTitle {
      position: relative;
      padding: 25px;
      background-color: #fff;
      border-radius: 60px 0 0;

      // height: 130px;
      .wrapDay {
        display: flex;
        align-items: center;
        justify-content: space-between;

        .btnFilter {
          i {
            font-size: 20px;
            color: #60563d;
          }
        }

        .circle {
          opacity: 0;
          visibility: hidden;
          border-radius: 10px;
          width: 105px;
          display: block;
          position: absolute;
          top: 65px;
          right: 17px;
          z-index: 2;
          padding-left: 0px;
          background: #fff;
          box-shadow: -2px 6px 18px #ccc;
          transition: all 0.8 ease-in-out;

          div {
            padding: 5px 15px;
            // border-radius: 0;
            background: #cccccc14;
            font-size: 14px;
            color: #6D4C41;
          }

          .active {
            background-color: #60563d;
            ;
            color: #fff;
            border-radius: 10px;
          }
        }
      }

      .circle.show {
        opacity: 1;
        visibility: visible;
      }

      h2,
      .unfinished {
        color: #60563d;
        margin-bottom: 10px;
      }

      .unfinished {
        font-size: 14px;
      }

      .meter {
        height: 9px;
        position: relative;
        background: #e3e1de;
        -moz-border-radius: 25px;
        -webkit-border-radius: 25px;
        border-radius: 25px;
        // margin-bottom: 1.5rem;
        // padding: 5px;
        box-shadow: inset 0 -1px 1px rgba(255, 255, 255, 0.3);

        #myBar {
          border-radius: 25px;
          width: 0%;
          height: 9px;
          background-color: #fb756a;
          padding: 4px 0;
          transition: all 1s ease-in-out;
        }
      }

    }

    .card-box {
      padding: 0 25px 25px 25px;
      max-height: 75%;
      overflow: auto;
    }

    .empty {
      margin-top: 30px;
      font-size: 18px;
      color: #EF5350;
    }

    .card-list {
      margin-bottom: 20px;
      display: flex;
      align-items: center;
      border: 1px solid #ccc;
      padding: 16px 10px;
      border-radius: 20px;

      .btn-check {
        width: 10%;

        i {
          font-size: 18px;
          margin-right: 10px;
          color: #fb756a;
        }
      }

      .title {
        overflow-wrap: anywhere;
        text-transform: capitalize;
        font-weight: 900;
        color: #60563d;
        overflow: hidden;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
      }

      .title.cross,
      .card-desc.cross {
        text-decoration: line-through;
        text-decoration-color: #6D4C41;
        opacity: 0.4;
      }

      .card-desc {
        overflow-wrap: anywhere;
        margin-top: 7px;
        font-size: 14px;
        color: #60563d;
        line-height: 15px;
      }

      .btn-group {
        display: flex;
        width: 15%;
        justify-content: space-between;

        i {
          font-size: 14px;
          color: #EF5350;
        }
      }

    }

    .btn-float {
      position: fixed;
      bottom: 0;
      right: 0;
      margin-bottom: 15px;
      margin-right: 15px;
    }

    button {
      @extend %btn;
      padding: 14px 16px;

      i {
        font-size: 20px;
        color: #fff;
      }
    }
  }

  %btn {
    background: linear-gradient(71deg, #fa5e6f 30%, #fb9561 70%);
    border-radius: 50%;
    border: none;
    box-shadow: 2px 6px 9px 2px #ef535061;
  }

  .bg-modal,
  .bg-modalComplete {
    opacity: 0;
    visibility: hidden;
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    text-align: left;
    background: #000000ab;
    transition: opacity .25s ease;
  }

  .bg-modal.active,
  .bg-modalComplete.active {
    opacity: 1;
    visibility: visible;
    transition: opacity .25s ease;
  }

  .add-modal.active,
  .modalComplete.active {
    opacity: 1;
    visibility: visible;
    top: 0;
    transition: top .25s ease;
  }

  %modal {
    visibility: hidden;
    background-color: #fff;
    transition: top .25s ease;
    position: absolute;
    top: 100%;
    right: 0;
    bottom: 0;
    left: 0;
    margin: auto;
    overflow: auto;
    border-radius: 5px;
    padding: 1em;
    opacity: 0;
    width: 93%;
  }

  .add-modal {
    @extend %modal;
    z-index: 1;
    height: 480px;
    overflow: hidden;

    h2 {
      margin-bottom: 19px;
      color: #6D4C41;
      text-align: center;
    }

    div {
      margin-bottom: 15px;

      input,
      textarea {
        font-size: 16px;
        display: inherit;
        margin-top: 10px;
        width: 100%;
        padding: 3px;
        border: 0;
        background: #d2691e17;
      }

      .title-mdl {
        color: #EF5350;
        font-weight: 900;
        margin-bottom: 10px;

        i {
          font-size: 12px;
          margin-right: 5px;

        }
      }
    }

    .btn-modal {
      position: absolute;
      bottom: -15px;
      right: 0;

      button {
        @extend %btn;
        padding: 14px;

        i {
          font-size: 20px;
          color: #fff;
        }
      }
    }
  }

  %btnConfirm {
    font-weight: 600;
    border-radius: 17px;
    font-size: 14px;
  }

  .modalComplete {
    @extend %modal;
    height: 130px;

    .title {
      margin-bottom: 30px;
      font-size: 18px;
      font-weight: 600;
      color: #EF5350;
    }

    .btnY {
      border: none;
      background: linear-gradient(71deg, #fa5e6f 30%, #fb9561 70%);
      @extend %btnConfirm;
      color: #fff;
      padding: 10px;
    }

     .btnYes {
      border: none;
      background: linear-gradient(71deg, #fa5e6f 30%, #fb9561 70%);
      @extend %btnConfirm;
      color: #fff;
      padding: 10px 20px;
    }

    .btnN {
      // @extend %btn;
      border: 1px solid #EF5350;
      background-color: #fff;
      color: #EF5350;
      padding: 10px;
      margin-left: 20px;
      @extend %btnConfirm;
    }
  }

  .timeWrap {
    .time {
      width: 250px;
      top: -200px !important;

      // height: 100px;
      .cell {
        color: #6D4C41;
        font-size: 13px;
        height: 30px !important;
        line-height: 30px !important;
      }

      .cell.selected {
        background: #EF5350 !important;
        color: #fff;
      }
    }
  }

  button:focus {
    outline: none;
  }
  .wrapLoad{
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    left: 0;
    /* align-items: center; */
    position: absolute;
  }
  .lds-roller {
    width: 80px;
    height: 80px;
  }

  .lds-roller div {
    animation: lds-roller 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
    transform-origin: 40px 40px;
  }

  .lds-roller div:after {
    content: " ";
    display: block;
    position: absolute;
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: #EF5350;
    margin: -4px 0 0 -4px;
  }

  .lds-roller div:nth-child(1) {
    animation-delay: -0.036s;
  }

  .lds-roller div:nth-child(1):after {
    top: 63px;
    left: 63px;
  }

  .lds-roller div:nth-child(2) {
    animation-delay: -0.072s;
  }

  .lds-roller div:nth-child(2):after {
    top: 68px;
    left: 56px;
  }

  .lds-roller div:nth-child(3) {
    animation-delay: -0.108s;
  }

  .lds-roller div:nth-child(3):after {
    top: 71px;
    left: 48px;
  }

  .lds-roller div:nth-child(4) {
    animation-delay: -0.144s;
  }

  .lds-roller div:nth-child(4):after {
    top: 72px;
    left: 40px;
  }

  .lds-roller div:nth-child(5) {
    animation-delay: -0.18s;
  }

  .lds-roller div:nth-child(5):after {
    top: 71px;
    left: 32px;
  }

  .lds-roller div:nth-child(6) {
    animation-delay: -0.216s;
  }

  .lds-roller div:nth-child(6):after {
    top: 68px;
    left: 24px;
  }

  .lds-roller div:nth-child(7) {
    animation-delay: -0.252s;
  }

  .lds-roller div:nth-child(7):after {
    top: 63px;
    left: 17px;
  }

  .lds-roller div:nth-child(8) {
    animation-delay: -0.288s;
  }

  .lds-roller div:nth-child(8):after {
    top: 56px;
    left: 12px;
  }

  @keyframes lds-roller {
    0% {
      transform: rotate(0deg);
    }

    100% {
      transform: rotate(360deg);
    }
  }
</style>

<!-- The core Firebase JS SDK is always required and must be listed first -->

<script src="../js/home.js">
</script>