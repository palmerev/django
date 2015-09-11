from django.db import models
from django.contrib.auth.models import User

# Create your models here.

class Note(models.Model):
    name = models.CharField(max_length=3, blank=True)
    octave = models.PositiveSmallIntegerField(default=0)

    def __unicode__(self): #__str__ in python3
        return str(self.name) + str(self.octave)

    def __str__(self): #__str__ in python3
        return str(self.name) + str(self.octave)

class IntervalType(models.Model):
    '''A list of predefined interval types / qualities'''
    quality = models.CharField(max_length=20, null=True, blank=True)

    def __unicode__(self): #__str__ in python3
        return "quality: " + str(self.quality)

    def __str__(self): #__str__ in python3
        return "quality: " + str(self.quality)

class Interval(models.Model):
    '''Two notes a specific distance (interval) apart.'''
    #TODO:??? make function to generate name based on top_note and bottom_note values
    name = models.ForeignKey(IntervalType, null=True, blank=True)
    top_note = models.ForeignKey(Note, related_name="top_note", null=True, blank=True)
    bottom_note = models.ForeignKey(Note, related_name="bottom_note", null=True, blank=True)

    def __unicode__(self): #__str__ in python3
        return "interval: " + str(self.name) + ", top: " + str(self.top_note) + ", bottom: " + str(self.bottom_note)

    def __str__(self): #__str__ in python3
        return "interval: " + str(self.name) + ", top: " + str(self.top_note) + ", bottom: " + str(self.bottom_note)

class ScaleType(models.Model):
    '''A list of scale types / qualities'''
    quality = models.CharField(max_length=25, null=True, blank=True)

    def __unicode__(self): #__str__ in python3
        return "(quality: " + str(self.quality) + ")"

    def __str__(self): #__str__ in python3
        return "(quality: " + str(self.quality) + ")"

class Scale(models.Model):
    '''A collection of notes organized by frequency.'''
    name = models.CharField(max_length=50, blank=True)
    tonic = models.ForeignKey(Note, null=True)
    quality = models.ForeignKey(ScaleType, null=True)
    ascending = models.BooleanField(default=True)

    def __unicode__(self): #__str__ in python3
        return "scale: " + str(self.name) + ", " + "quality: " + str(self.quality) + ", " + "ascending: " + str(self.ascending)

    def __str__(self): #__str__ in python3
        return "scale: " + str(self.name) + ", " + "quality: " + str(self.quality) + ", " + "ascending: " + str(self.ascending)

class ChordType(models.Model):
    '''A list of chord types / qualities'''
    quality = models.CharField(max_length=20, null=True, blank=True)

    def __unicode__(self): #__str__ in python3
        return "(quality: " + str(self.quality) + ")"

    def __str__(self): #__str__ in python3
        return "(quality: " + str(self.quality) + ")"

class Chord(models.Model):
    '''A set of at least three notes.'''
    root = models.ForeignKey(Note, null=True)
    quality = models.ForeignKey(ChordType, null=True)

    def __unicode__(self): #__str__ in python3
        return "(root: " + str(self.root) + ", " + "quality: " + str(self.quality) + ")"

    def __str__(self): #__str__ in python3
        return "(root: " + str(self.root) + ", " + "quality: " + str(self.quality) + ")"

class CourseType(models.Model):
    title = models.CharField(max_length=50, null=True, blank=True)

    def __unicode__(self): #__str__ in python3
        return str(self.title)

    def __str__(self): #__str__ in python3
        return str(self.title)

class Course(models.Model):
    course_type = models.ForeignKey(CourseType, blank=True, null=True)
    num_exercises = models.PositiveSmallIntegerField(default=10, null=True)

    def __unicode__(self): #__str__ in python3
        return "course on " + str(self.course_type)

    def __str__(self): #__str__ in python3
        return "course on " + str(self.course_type)

class Exercise(models.Model):
    name = models.CharField(max_length=30, null=True, blank=True)
    interval_answer = models.ForeignKey(Interval, null=True, blank=True)
    scale_answer = models.ForeignKey(Scale, null=True, blank=True)
    chord_answer = models.ForeignKey(Chord, null=True, blank=True)
    course = models.ForeignKey(Course, null=True, blank=True)

    def __unicode__(self): #__str__ in python3
        return str(self.name) + ", " + str(self.id)

    def __str__(self): #__str__ in python3
        return str(self.name) + ", " + str(self.id)

class Student(models.Model):
    stuser = models.OneToOneField(User, primary_key=True)
    total_exercises_completed = models.PositiveIntegerField(default=0, null=True, blank=True)
    courses_completed = models.PositiveSmallIntegerField(default=0, null=True, blank=True)

    def __unicode__(self): #__str__ in python3
        return str(self.stuser)

    def __str__(self): #__str__ in python3
        return str(self.stuser)

class ExerciseStatus(models.Model):
    status = models.CharField(max_length=25, default="")

    def __unicode__(self): #__str__ in python3
        return str(self.status)

    def __str__(self): #__str__ in python3
        return str(self.status)

class StudentExercise(models.Model):
    student = models.ForeignKey(Student)
    exercise = models.ForeignKey(Exercise)
    result = models.ForeignKey(ExerciseStatus, null=True, blank=True)

    def __unicode__(self): #__str__ in python3
        return str(self.student) + ", " + str(self.exercise)

    def __str__(self): #__str__ in python3
        return str(self.student) + ", " + str(self.exercise)

class CourseStats(models.Model):
    student = models.ForeignKey(Student)
    course = models.ForeignKey(Course)
    course_complete = models.BooleanField(default=False)

    def __unicode__(self): #__str__ in python3
        return "CourseStats for " + str(self.course)

    def __str__(self): #__str__ in python3
        return "CourseStats for " + str(self.course)
