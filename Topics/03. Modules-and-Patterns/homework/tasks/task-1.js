function solve() {
    let students = [],
        studentCounter = students.length + 1,
        studentIDList = [];

    function isString(input) {
        if (typeof input === 'string') {
            return true;
        } else {
            return false;
        }
    }

    function validName(input) {
        if (/^[a-z]/.test(input)) {
            return false;
        } else if (/\*[a-z]*$/.test(input)) {
            return false;
        } else {
            return true;
        }
    }
    var Course = {


        init: function(title, presentations) {
            if (presentations.length < 1) {
                throw Error("There must be any presentations");
            }

            function validateTitle(string) {
                if (string[0] === " " || string[string.length - 1] === " ") {
                    throw Error("Title should not start or end with empty space")
                }
                if (/\s\s/g.test(string)) {
                    throw Error("Titles must not contain consecutive spaces")
                }
                if (string.length < 1) {
                    throw Error("Titles have at least one character")
                }
            }
            validateTitle(title);
            for (var presTitle of presentations) {
                validateTitle(presTitle);
            }
        },

        addStudent: function(name) {
            if (!isString(name)) {
                throw Error("Student name is not valid string");
            }
            let nameArray = name.split(" "),
                fName = nameArray[0],
                sName = nameArray[1];
            if (!sName) {
                throw Error("Only one name inputed. Student must have two names");
            }
            if (nameArray.length > 2) {
                throw Error("Student must not have more than two names")
            }
            if (!validName(fName) || !validName(sName)) {
                throw Error("Student name is not valid")
            }
            Course.students = []; //or this.students
            Course.homeworks = []; //or this.homeworks
            let student = {
                fistName: fName,
                lastName: sName,
                id: studentCounter
            }
            students.push(student);
            console.log(student.id);
            return student.id;
        },

        getAllStudents: function() {

        },
        submitHomework: function(studentID, homeworkID) {},
        pushExamResults: function(results) {},
        getTopStudents: function() {}
    };

    return Course;
}


module.exports = solve;