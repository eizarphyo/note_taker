import { Component } from '@angular/core';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  colors: any = ['red', 'orange', 'yellow', 'green', 'teal', 'lightblue', 'blue', 'violet', 'pink', 'brown']

  showPopup?: boolean;
  showSetting: boolean = false;
  showSettingIndex?: number;

  popupBtnName?: string;
  isEdit?: boolean;
  editNoteIndex!: number;
  bgColor?: string;
  coloredNoteIndex?: number;

  inputTitle?: string = '';
  inputDescript?: string = '';

  notes?: any = [];
  noteCount: number = 0;


  ngOnInit() {
    console.log(this.notes.length);

    this.renderNotes();
  }

  // local storage ထဲက ဒေတာယူ၊ template မှာပြ
  renderNotes() {
    this.noteCount = Number(localStorage.getItem('count'));

    for (let i = 0; i < this.noteCount; i++) {
      let note: any = localStorage.getItem(`note${i}`);
      this.notes[i] = JSON.parse(note);
      console.log(this.notes);
    }
  }


  onClick() {
    if (this.isEdit) {
      this.updateNote();
      this.isEdit = false;
    } else {
      this.createNote();
    }
    this.bgColor = '';
  }

  createNote() {
    let i = this.notes.length;

    let inputData = { 'title': this.inputTitle, 'description': this.inputDescript, 'bgColor': this.bgColor };
    this.inputTitle = '';
    this.inputDescript = '';
    this.bgColor = '';

    localStorage.setItem(`note${i}`, JSON.stringify(inputData));

    let note: any = localStorage.getItem(`note${i}`);
    this.notes[i] = JSON.parse(note);

    this.noteCount++;
    localStorage.setItem('count', String(this.noteCount));
    this.closePopup();
  }

  edit(index: number) {
    this.showSetting = !this.showSetting;
    this.showPopup = true;
    this.isEdit = true;
    this.popupBtnName = 'Update';
    this.editNoteIndex = index;
    // console.log('note index', this.editNoteIndex);

    var note: any = localStorage.getItem(`note${index}`);
    note = JSON.parse(note);
    this.inputTitle = note.title;
    this.inputDescript = note.description;
    this.bgColor = note.bgColor;
  }

  updateNote() {
    let index = this.editNoteIndex;
    let inputData = { 'title': this.inputTitle, 'description': this.inputDescript, 'bgColor': this.bgColor };

    this.inputTitle = '';
    this.inputDescript = '';

    localStorage.setItem(`note${index}`, JSON.stringify(inputData));
    this.notes[index] = inputData;
    console.log("edited notes", this.notes);

    // this.coloredNoteIndex = index
    this.showSetting = !this.showSetting;
    this.showPopup = !this.showPopup;
  }


  deleteNote(index: number) {
    this.notes.splice(index, 1);
    localStorage.clear();

    this.noteCount--;
    localStorage.setItem('count', String(this.noteCount));

    for (let i = 0; i < this.notes.length; i++) {
      let note = this.notes[i];
      localStorage.setItem(`note${i}`, JSON.stringify(note));
    }
    this.showSetting = !this.showSetting;
  }

  setColor(color: string) {
    console.log('color', color);
    // if (color == 'red') {
    //   this.bgColor = '#f28b82';
    // }

    this.bgColor = color;
  }

  select(evt: any) {
    console.log(evt);

    evt.srcElement.classList.add("select");
  }



  openPopup() {
    this.showPopup = !this.showPopup;
    this.popupBtnName = 'Add';
  }

  closePopup() {
    this.showPopup = !this.showPopup;
  }

  openSetting(index: number) {
    this.showSettingIndex = index;
    this.showSetting = !this.showSetting;
  }


}
