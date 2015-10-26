from django.contrib import admin
from .models import Note
from .models import Interval
from .models import IntervalType
from .models import Scale
from .models import ScaleType
from .models import Chord
from .models import ChordType
# from .models import CourseSelection
from .models import Course
from .models import CourseType
# from .models import CourseProgress
# from .models import ExercisePage
from .models import Exercise
from .models import Student
from .models import CourseStats
from .models import StudentExercise
from .models import ExerciseStatus


class ExerciseInline(admin.TabularInline):
    model = Exercise
    extra = 3


class CourseAdmin(admin.ModelAdmin):
    fields = [
        'course_type', 'num_exercises'
    ]
    inlines = [ExerciseInline]


# Register your models here.
admin.site.register(Note)
admin.site.register(Interval)
admin.site.register(IntervalType)
admin.site.register(Scale)
admin.site.register(ScaleType)
admin.site.register(Chord)
admin.site.register(ChordType)
# admin.site.register(CourseSelection)
admin.site.register(Course, CourseAdmin)
admin.site.register(CourseType)
# admin.site.register(CourseProgress)
# admin.site.register(ExercisePage)
admin.site.register(Exercise)
admin.site.register(Student)
admin.site.register(CourseStats)
admin.site.register(StudentExercise)
admin.site.register(ExerciseStatus)
