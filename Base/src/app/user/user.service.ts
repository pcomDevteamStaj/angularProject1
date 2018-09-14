import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';

import { User } from './user.model';

@Injectable({ providedIn: 'root' })
export class UserService {

  private users: User[] = [];
  private usersUpdated = new Subject<User[]>();

  constructor(private http: HttpClient) {}

  getUser() {
    this.http
      .get<{ message: string; posts: any }>(
        'http://localhost:3000/api/users'
      )
      .pipe(map((postData) => {
        return postData.posts.map(post => {
        return{
          userId: post._id,
          UserName: post.UserName,
          password: post.password,
          Mail: post.mail,
          Tel: post.tel,
          Title: post.title,
          Gender: post.gender
        };
      });
  }))
      .subscribe(transformedPost => {
        this.users = transformedPost;
        this.usersUpdated.next([...this.users]);
      });
  }

  addUser(UserName: string, password: string, mail: string, tel: string, title: string, gender: string) {
    const user: User = { userId: null, UserName: UserName, password: password, mail: mail, tel: tel, title: title, gender: gender};

   this.http
   .post<{ message: string, postId: string  }>('http://localhost:3000/api/users', user)
   .subscribe(responseData => {
    const id = responseData.postId;
    user.userId = id;
    this.users.push(user);
    this.usersUpdated.next([...this.users]);
  });
}
  }





