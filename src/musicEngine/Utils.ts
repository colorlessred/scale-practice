export class Utils {
    public static smartMod(a: number, b: number): number {
        let c = a % b;
        if (c < 0) {
            c += b;
        }
        return c;
    }
}
