import {Component, OnInit} from '@angular/core';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import {FormControl, FormGroup, ValidationErrors, Validators} from '@angular/forms';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'Trello Board';
  modalType : string = "";
  modalVisible : boolean = false;
  listIndex;

  itemFormData = new FormGroup({
    itemName : new FormControl('', Validators.required),
    itemDesc : new FormControl(''),
  })

  // itemFormData = {
  //   itemName : "",
  //   itemDesc : "",
  // }



  newListName = new FormControl('', Validators.required);
  constructor(
  ){ }

  dataSource = [

  ]

  ngOnInit() : void{
    let retrieved_data = localStorage.getItem('stored_data');
    if(retrieved_data){
      this.dataSource = JSON.parse(retrieved_data);
    }
  }

  // dataSource = [
  //     {
  //       name : "Teams",
  //       data : [
  //         {
  //           title : "Item A",
  //           desc : "Description",
  //           creation_time : "Date"
  //         },
  //         {
  //           title : "Item A",
  //           desc : "Description",
  //           creation_time : "Date"
  //         },
  //         {
  //           title : "Item A",
  //           desc : "Description",
  //           creation_time : "Date"
  //         },
  //         {
  //           title : "Item A",
  //           desc : "Description",
  //           creation_time : "Date"
  //         },
  //         {
  //           title : "Item A",
  //           desc : "Description",
  //           creation_time : "Date"
  //         },
  //         {
  //           title : "Item A",
  //           desc : "Description",
  //           creation_time : "Date"
  //         },
  //         {
  //           title : "Item A",
  //           desc : "Description",
  //           creation_time : "Date"
  //         },
  //         {
  //           title : "Item A",
  //           desc : "Description",
  //           creation_time : "Date"
  //         }
  //       ]
  //     },
  //     {
  //       name : "Product",
  //       data : [
  //         {
  //           title : "Product A",
  //           desc : "Description",
  //           creation_time : "Date"
  //         },
  //       ]
  //     },

  // ]

  onDrop(event : CdkDragDrop<string[]>, index){
    if(event.previousContainer.id === event.container.id){
      // moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    }else{
      for(let obj of event.container.data){
        if(JSON.parse(JSON.stringify(obj)).title === event.item.data.title){
          break;
        }
      }
      let elementIndex = undefined;
      for(let i = 0; i<this.dataSource[index].data.length ; i++){
        console.log(this.dataSource[index].data[i].creation_time);
        console.log(event.item.data.creation_time);
        console.log(this.dataSource[index].data[i].creation_time > event.item.data.creation_time)
        if(this.dataSource[index].data[i].creation_time > event.item.data.creation_time){
          elementIndex = i;
          break;
        }
      }

      if(elementIndex === undefined){
        transferArrayItem(event.previousContainer.data,
          event.container.data,
          event.previousIndex, this.dataSource[index].data.length )
      }else{
        transferArrayItem(event.previousContainer.data,
          event.container.data,
          event.previousIndex, elementIndex);
      }
    }

    localStorage.setItem('stored_data', JSON.stringify(this.dataSource));
  }
  
  openAddListModal(){
    this.modalVisible = true;
    this.modalType = "newListModal"
  }

  closeModal(){
    this.modalVisible = false;
    this.cleanForms();

  }

  cleanForms(){
    this.itemFormData.reset();
    this.newListName.reset()
  }

  addList(){
    console.log(this.newListName.value)
    this.dataSource.push({
      name : this.newListName.value,
      data : [],
    })

    this.closeModal();
    localStorage.setItem('stored_data', JSON.stringify(this.dataSource));

  }

  openAddItemModal(i){
    this.modalVisible = true;
    this.modalType = "newElementModal";
    this.listIndex = i;
  }

  addItem(){
    this.dataSource[this.listIndex].data.push(
      {
        title : this.itemFormData.get('itemName').value,
        desc : this.itemFormData.get('itemDesc').value,
        creation_time : new Date()
      }
    )
    this.closeModal();
    localStorage.setItem('stored_data', JSON.stringify(this.dataSource));

  }

  removeList(i){
    this.dataSource.splice(i,1);
    localStorage.setItem('stored_data', JSON.stringify(this.dataSource));

  }

  removeItem(dataSourceIndex, itemIndex){
    this.dataSource[dataSourceIndex].data.splice(itemIndex,1);
    localStorage.setItem('stored_data', JSON.stringify(this.dataSource));

  }
  
}
