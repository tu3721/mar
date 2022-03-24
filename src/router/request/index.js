import $http from '../../utils/http';


export function getImg(data) {
    return $http.get('api/Preview/getInfo',data);
}