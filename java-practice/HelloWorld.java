public class HelloWorld {

    public static void main(String[] args) {

        String str = "SDET";
        StringBuilder reversed = new StringBuilder();

for (int i = str.length() - 1; i >= 0; i--) {
    reversed.append(str.charAt(i)); // Appends efficiently without creating new objects
}

System.out.println(reversed.toString());
}}

//constructor with parameterized 

