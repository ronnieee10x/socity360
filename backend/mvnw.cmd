@echo off
set DIR=%~dp0
set JAVA_HOME=C:\Program Files\Java\jdk-21
call "%DIR%apache-maven-3.9.6\bin\mvn.cmd" -Dmaven.repo.local="%DIR%..\.m2_repo" %*
