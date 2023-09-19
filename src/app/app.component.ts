import { Component } from '@angular/core';
import { ApiService } from './services/api.service';
import { Note } from './model/note_model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(
    private api: ApiService
  ) { }

  title = 'notepad';

  // colors: any = ['red', 'orange', 'yellow', 'green', 'teal', 'lightblue', 'blue', 'violet', 'pink', 'brown'];
  colors: any = ['#f28b82', '#fbbc04', '#fff475', '#ccff90', '#a7ffeb', '#cbf0f8', '#aecbfa', '#d7aefb', '#fdcfe8', '#e6c9a8'];

  loading: boolean = false;
  showPopup?: boolean;
  showSetting: boolean = false;
  showSettingIndex?: number;
  showNoteDetailsBox: boolean = false;

  popupBtnName?: string;
  isEdit?: boolean;
  editNoteIndex!: number;
  bgColor?: string;

  inputTitle?: string = '';
  inputDescript?: string = '';

  // notes?: any = [];
  notes: Note[] = [];
  noteDetails: Note = {} as Note;
  token: string = '';

  ngOnInit() {
    this.renderNotes();
  }

  async renderNotes() {
    let token = localStorage.getItem('token');
    console.log(`token >>> ${token}`);

    if (token == undefined) {
      console.log("TOKEN UNDEFINED");
      this.token = await this.api.createGuest();
      // let token: string = await this.api.createGuest();
      localStorage.setItem('token', this.token);
      console.log(localStorage.getItem('token'));
    } else {
      console.log("TOKEN NOT UNDEFINED");
      this.token = token;
      this.notes = await this.api.getAllGuestNotes(this.token);
      console.log(this.notes);
    }
  }

  trackByNoteId(index: number, note: Note) {
    return note._id;
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

  async createNote() {
    let token = localStorage.getItem('token');

    let note: Note = { 'title': this.inputTitle || "", 'content': this.inputDescript || "", 'bgColor': this.bgColor || "#e8eaed" };

    this.clearInputs();
    this.closePopup();

    this.loading = true;

    let newNote: Note = await this.api.createGuestNote(token!, note);
    console.log(`created Note 👉 ${newNote}`);
    this.notes.push(newNote);
    this.loading = false;
  }

  async showNoteDetails(index: number) {
    this.loading = true;
    let note = this.notes[index];
    this.noteDetails = await this.api.getGuestNote(this.token, note._id!);
    console.log(this.noteDetails);
    this.showNoteDetailsBox = !this.showNoteDetailsBox;
    this.loading = false;
  }

  closeNoteDetialsBox() {
    this.showNoteDetailsBox = !this.showNoteDetailsBox;
  }

  async edit(index: number) {
    this.showSetting = !this.showSetting;
    this.showPopup = true;
    this.isEdit = true;
    this.popupBtnName = 'Update';
    this.editNoteIndex = index;

    let note: Note = this.notes[index];

    // Show contents in input fields
    this.inputTitle = note.title;
    this.inputDescript = note.content;
    this.bgColor = note.bgColor;
  }

  async updateNote() {
    let body: Note = {
      'title': this.inputTitle || "",
      'content': this.inputDescript || "",
      'bgColor': this.bgColor || "#e8eaed"
    };

    this.clearInputs();
    this.showSetting = false;
    this.showPopup = false;

    let note = this.notes[this.editNoteIndex];

    this.loading = true;
    let updatedNote: Note = await this.api.editeGuestNote(this.token, note._id!, body);
    this.notes.splice(this.editNoteIndex, 1, updatedNote);
    this.loading = false;
  }

  async deleteNote(index: number) {
    this.showSetting = false;

    let note = this.notes[index];
    this.loading = true;
    await this.api.deleteGuestNote(this.token, note._id!);
    this.notes.splice(index, 1);
    this.loading = false;
  }

  clearInputs() {
    this.inputTitle = '';
    this.inputDescript = '';
    this.bgColor = '';
  }

  setColor(color: string) {
    // console.log('color', color);
    this.bgColor = color;
  }

  select(evt: any) {
    console.log(evt);

    let classes: any = evt.srcElement.classList;
    let foundSelectClass: boolean = false;

    for (let index = 0; index < classes.length; index++) {
      if (classes[index] == 'select') {
        foundSelectClass = true;
        break;
      }
    }

    if (foundSelectClass) {
      evt.srcElement.classList.remove("select");
    } else {
      evt.srcElement.classList.add("select");
    }

  }

  openPopup() {
    this.showPopup = !this.showPopup;
    this.clearInputs();

    this.popupBtnName = 'Add';
  }

  closePopup() {
    this.showPopup = false;
    console.log("CLOSED POPUP");
  }

  openSetting(index: number) {
    this.showSettingIndex = index;
    this.showSetting = !this.showSetting;
  }

  ngOnDestroy() {
    this.api.unsubscribeSubs();
  }
}
