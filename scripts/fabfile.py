from fabric.api import run, sudo, cd, env

env.roledefs = {
  'prod': ['eob@treesheets.csail.mit.edu'],
} 

def restart_nginx():
  """Restarts nginx."""
  sudo('/etc/init.d/nginx restart')

def restart_treesheets():
  """Restarts the NodeJS process."""
  sudo('/etc/init.d/treesheets restart')

def update_treesheets():
  """Updates git."""
  with cd('/sites/treesheets.org/code'):
    run('git pull origin master')
    run('git submodule update')

def deploy():
  """Updates git and restarts."""
  update_treesheets()
  restart_treesheets()

def main():
  print """
  This file uses Fabric <http://fabfile.org> to run.

  Usage:
    fab -H <HOST> <COMMAND>

  Commands:
    upkick -- updates git and restarts
    update_treesheets
    restart_treesheets
    restart_nginx
"""  
 
if __name__ == "__main__":
  main()
