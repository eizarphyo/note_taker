import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { apiBaseUrl } from '../utils/constants';
import { Guest, TokenResponse } from '../model/user_model';
import { SubSink } from 'subsink';
import { Note } from '../model/note_model';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  constructor(
    private http: HttpClient,
  ) { }

  subs = new SubSink();

  // guests: Array<Guest> = [];
  // guest: Guest = {} as Guest;

  // createGuest: String = `${baseUrl}/guests`;

  createGuest(): Promise<string> {
    return new Promise((resolve, reject) => {
      this.subs.sink = this.http.post(`${apiBaseUrl}/guest`, {}).subscribe({
        next: (res: any) => {
          console.log(`token from api response >> ${res.token}`);
          resolve(res.token);
        },
        error: (err: any) => {
          console.log(err);
          reject(err);
        }
      });
    });

    // this.http.post(`${apiBaseUrl}/guests`, {}).subscribe({
    //   next: (res: any) => {
    //     return res.guests;
    //   },
    //   error: (err: any) => {
    //     console.log(err);
    //     throw err;
    //   }
    // });
  }

  createGuestNote(token: string, body: Note): Promise<Note> {
    const header = { headers: new HttpHeaders({ "Authorization": `Bearer ${token}` }) };

    return new Promise((resolve, reject) => {
      this.subs.sink = this.http.post(`${apiBaseUrl}/guest/note`, body, header).subscribe({
        next: (res: any) => {
          console.log(`note from api response >> ${res.note}`);
          resolve(res.note)
        },
        error: (err: any) => {
          console.log(err);
          reject(err);
        }
      });
    })
  }

  getGuestNote(token: string, id: String): Promise<Note> {
    const header = { headers: new HttpHeaders({ "Authorization": `Bearer ${token}` }) };

    return new Promise((resolve, reject) => {
      this.subs.sink = this.http.get(`${apiBaseUrl}/guest/note/${id}`, header).subscribe({
        next: (res: any) => {
          console.log(`note from api response >> ${res.note}`);
          resolve(res.note);
        }, error: (err: any) => {
          console.log(err);
          reject(err);
        }
      });
    });
  }

  editeGuestNote(token: string, id: string, body: Note): Promise<Note> {
    const header = { headers: new HttpHeaders({ "Authorization": `Bearer ${token}` }) };

    return new Promise((resolve, reject) => {
      this.subs.sink = this.http.patch(`${apiBaseUrl}/guest/note/${id}`, body, header).subscribe({
        next: (res: any) => {
          console.log(`note from api response >> ${res.note}`);
          resolve(res.note);
        }, error: (err: any) => {
          console.log(err);
          reject(err);
        }
      });
    })
  }

  deleteGuestNote(token: string, id: string) {
    const header = { headers: new HttpHeaders({ "Authorization": `Bearer ${token}` }) };

    return new Promise((resolve, reject) => {
      this.subs.sink = this.http.delete(`${apiBaseUrl}/guest/note/${id}`, header).subscribe({
        next: (res: any) => {
          console.log(res);
          resolve(true);
        },
        error: (err: any) => {
          console.log(err);
          reject(err);
        }
      });
    });
  }

  getAllGuestNotes(token: string): Promise<Note[]> {
    // const header: new HttpHeaders({
    //   "Authorization": `Bearer ${token}`
    // });

    return new Promise((resolve, reject) => {
      this.subs.sink = this.http.get(`${apiBaseUrl}/guest/note`, { headers: new HttpHeaders({ "Authorization": `Bearer ${token}` }) }).subscribe({
        next: (res: any) => {
          console.log(`notes from api response >> ${res.notes}`);
          resolve(res.notes);
        },
        error: (err: any) => {
          console.log(err);
          reject(err);
        }
      });
    })
  }

  unsubscribeSubs() {
    this.subs.unsubscribe();
  }

}
