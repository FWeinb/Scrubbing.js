module.exports = function(grunt) {

  require('load-grunt-tasks')(grunt);

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concat: {
      dist: {
        src: [  'src/intro.js',

                'src/Helper.js',

                'src/Adapter/*.js',
                'src/Resolver/BasicResolver.js',
                'src/Resolver/DefaultResolver.js',

                'src/Driver/MouseDriver.js',
                'src/Driver/TouchDriver.js',
                'src/Driver/MouseWheelDriver.js',


                'src/Defaults.js',
                'src/Scrubbing.js',

                'src/outro.js'
             ],
        dest: 'dist/<%= pkg.name %>.js'
      }
    },
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> \n * Fabrice Weinberg \n */\n'
      },
      dist: {
        files: {
          'dist/<%= pkg.name %>.min.js': ['<%= concat.dist.dest %>']
        }
      }
    },
    docco:{
      doc : {
        src: ['dist/<%= pkg.name %>.js'],
        options : {
          ouput : 'docs/'
        }
      }
    }
  });



  grunt.registerTask('build', ['concat', 'uglify', 'docco']);

};
