import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { URL } from '../../config/url.config';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { UiService } from './ui.service';

@Injectable({ providedIn: 'root' })
export class UsersService {

    constructor(private http: HttpClient, private uiService: UiService) { }

    getAllUsers(): Observable<any> {
        return this.http.get(`${URL}/user`).pipe(map(resp => resp['users']));
    };

    getUserById(id: string, limit = 10): Observable<any> {
        return this.http.get(`${URL}/user/${id}?limit=${limit}`);
    };

    getUserByUsername(username: string): Observable<any> {
        return this.http.get(`${URL}/user/get-user/${username}`).pipe(map(resp => resp['user']));
    };

    followUser(id: string): Observable<any> {
        return this.http.put(`${URL}/friends/follow-user`, { _id: id });
    };

    unFollowUser(id: string) {
        return this.http.put(`${URL}/friends/unfollow-user`, { _id: id });
    };

    markNotification(id: string, deleteValue?: boolean) {
        return this.http.put(`${URL}/friends/mark-notification/${id}`, {
            _id: id,
            deleteValue
        });
    };

    markAllAsRead() {
        return this.http.put(`${URL}/friends/mark-all`, { all: true });
    };

    addImage(file: File) {
        return this.http.put(`${URL}/images/upload-image`, { file });
    };

    deleteImage(image: any) {
        return this.http.put(`${URL}/images/delete-image/${image.imgId}`, { image });
    };

    udpateProfilePic(image: Image) {
        return this.http.put(`${URL}/images/update-profile-pic`, image);
    };

    viewProfileNotifications(id: string): Observable<any> {
        return this.http.put(`${URL}/user/view-profile`, { id });
    };

    changePassword(changePasswordObject: ChangePassword) {
        return this.http.put(`${URL}/user/change-password`, changePasswordObject).pipe(map(resp => {
            this.uiService.toastMessage(resp['message']);
        }));
    };

    getUserProfilePic(user: any) {
        if (!user) {
            return
        };

        if (user.img && user.google) {
            if (user.picVersion && user.picId && user.picVersion !== '1591573111' && user.picId !== 'avatar_tmoqrv.png') {
                return this.getImageUrl(user.picVersion, user.picId);
            }
            return user.img
        }
        return this.getImageUrl(user.picVersion, user.picId);
    }

    getImageUrl(picVersion, picId) {
        return `https://res.cloudinary.com/dnfm4fq8d/image/upload/v${picVersion}/${picId}`;
    }

};

interface Image {
    imgId: string,
    imgVersion: string,
    _id?: string
};

interface ChangePassword {
    password: string;
    newPassword: string;
    confirmPassword: string;
};