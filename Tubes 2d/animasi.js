export default class MatrixUtility {
    static createIdentityMatrix() {
        return [
            [1,0,0],
            [0,1,0],
            [0,0,1]
        ];
    }

    static multiplyMatrix(m1,m2){
        var hasil = [
            [0,0,0],
            [0,0,0],
            [0,0,0]
        ];

        for (var i=0; i<3; i++){
            for (var j=0; j<3; j++) {
                for (var k=0; k<3; k++){
                    hasil[i][k] += m1[i][j] * m2[j][k];  
                }
            }
        }

        return hasil;
    }

    static createTranslationMatrix(Tx,Ty) {
        return [
            [1,0,Tx],
            [0,1,Ty],
            [0,0,1]
        ];
    }
    static createRotationMatrix(angle){
        return [
            [Math.cos(angle), -Math.sin(angle),0],
            [Math.sin(angle), Math.cos(angle),0],
            [0,0,1]
        ]
    }
    static createScaleMatrix(Sx,Sy) {
        return [
            [Sx,0,0],
            [0,Sy,0],
            [0,0,1]
        ]
    }

    
    static createFixedPointRotationMatrix(anchor, angle) {
            var ancor = anchor[1];
            var m1 = this.createTranslationMatrix(-Math.abs(ancor.y),-Math.abs(ancor.x));
            var m2 = this.createRotationMatrix(angle);
            var m3 = this.createTranslationMatrix(ancor.x,ancor.y);

            var hasil;
            hasil = this.multiplyMatrix(m3,m2);
            hasil = this.multiplyMatrix(hasil,m1);
            return hasil
    }

    static createFixedPointScaleMatrix(anchor, Sx, Sy) {
        var ancor = anchor[1];
            var m1 = this.createTranslationMatrix(-Math.abs(ancor.y),-Math.abs(ancor.x));
            var m2 = this.createScaleMatrix(Sx,Sy);
            var m3 = this.createTranslationMatrix(ancor.x,ancor.y)

            var hasil;
            hasil = this.multiplyMatrix(m3,m2);
            hasil = this.multiplyMatrix(hasil,m1);
            return hasil
    }

    static transform_titik(titik_lama, m){
        var x_baru = m[0][0]*titik_lama.x + m[0][1]*titik_lama.y + m[0][2]*1;
        var y_baru = m[1][0]*titik_lama.x + m[1][1]*titik_lama.y + m[1][2]*1;

        return { x: x_baru, y : y_baru};
    }

    static transform_array(array_titik,m){
        var hasil = [];
        for (var i=0; i<array_titik.length;i++){
            var titik_hasil;
            titik_hasil = this.transform_titik(array_titik[i],m);
            hasil.push(titik_hasil);
        }
        return hasil;
    }
}